import { Worker } from 'worker_threads';
import * as path from 'path';
import * as os from 'os';
import { TranslationRequest, TranslationResult } from '../../models/types';
import { ContentChunk } from './content-processor';

// 计算每列内可以使用的最大子工作线程数
// 为避免过度并发造成资源争用，设置合理的上限
const CPU_CORES = os.cpus().length;
const MAX_CHUNK_WORKERS_PER_COLUMN = Math.max(2, Math.floor(CPU_CORES / 2));

/**
 * 内容块翻译请求
 */
export interface ChunkTranslationRequest extends TranslationRequest {
  /** 块ID */
  chunkId: number;
  /** 列键 */
  colKey: string;
}

/**
 * 内容块翻译结果
 */
export interface ChunkTranslationResult extends TranslationResult {
  /** 块ID */
  chunkId: number;
  /** 列键 */
  colKey: string;
}

/**
 * 内容块工作线程管理器
 * 负责将一列内容分成多个块进行并行翻译
 */
export class ChunkWorkerManager {
  private workers: Map<string, Worker> = new Map();
  private activeWorkers: number = 0;
  private taskQueue: Array<{
    chunk: ContentChunk;
    colKey: string;
    request: TranslationRequest;
    resolve: (result: ChunkTranslationResult) => void;
    reject: (error: Error) => void;
  }> = [];
  
  /**
   * 创建内容块工作线程管理器
   * @param maxConcurrentWorkers 最大并发工作线程数
   */
  constructor(
    private maxConcurrentWorkers: number = MAX_CHUNK_WORKERS_PER_COLUMN
  ) {}
  
  /**
   * 获取可用的工作线程数量
   * @returns 可用的工作线程数量
   */
  public getAvailableWorkerCount(): number {
    return this.maxConcurrentWorkers - this.activeWorkers;
  }
  
  /**
   * 提交内容块翻译任务
   * @param chunk 要翻译的内容块
   * @param colKey 列键
   * @param baseRequest 基础翻译请求
   * @returns 翻译结果Promise
   */
  public submitChunkTask(
    chunk: ContentChunk, 
    colKey: string, 
    baseRequest: TranslationRequest
  ): Promise<ChunkTranslationResult> {
    return new Promise((resolve, reject) => {
      // 创建块特定的翻译请求
      const chunkRequest: ChunkTranslationRequest = {
        ...baseRequest,
        content: chunk.content,
        chunkId: chunk.id,
        colKey: colKey
      };
      
      // 将任务添加到队列
      this.taskQueue.push({ 
        chunk, 
        colKey, 
        request: chunkRequest, 
        resolve, 
        reject 
      });
      
      // 尝试处理队列中的任务
      this.processQueue();
    });
  }
  
  /**
   * 处理队列中的任务
   */
  private processQueue(): void {
    // 如果队列为空或已达到最大并发数，则不处理
    if (this.taskQueue.length === 0 || this.activeWorkers >= this.maxConcurrentWorkers) {
      return;
    }
    
    // 从队列中取出一个任务
    const task = this.taskQueue.shift();
    if (!task) return;
    
    const { chunk, colKey, request, resolve, reject } = task;
    const taskId = `${colKey}-chunk-${chunk.id}`;
    
    // 创建新的工作线程
    try {
      this.activeWorkers++;
      
      // 创建工作线程
      const worker = new Worker(
        path.resolve(__dirname, 'chunk-worker.js'),
        {
          workerData: {
            request,
            chunkId: chunk.id,
            colKey
          }
        }
      );
      
      // 存储工作线程
      this.workers.set(taskId, worker);
      
      // 处理工作线程的消息
      worker.on('message', (result: ChunkTranslationResult) => {
        // 释放工作线程
        this.releaseWorker(taskId);
        
        // 处理结果
        if (result.success) {
          resolve({
            ...result,
            chunkId: chunk.id,
            colKey
          });
        } else {
          reject(new Error(`块 ${chunk.id} 翻译失败: ${result.error || '未知错误'}`));
        }
        
        // 继续处理队列中的下一个任务
        this.processQueue();
      });
      
      // 处理工作线程的错误
      worker.on('error', (error) => {
        this.releaseWorker(taskId);
        reject(error);
        this.processQueue();
      });
      
      // 处理工作线程的退出
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`块工作线程以退出码 ${code} 退出`));
        }
        this.releaseWorker(taskId);
        this.processQueue();
      });
    } catch (error) {
      this.activeWorkers--;
      reject(error instanceof Error ? error : new Error(String(error)));
      this.processQueue();
    }
  }
  
  /**
   * 释放工作线程
   * @param taskId 任务ID
   */
  private releaseWorker(taskId: string): void {
    const worker = this.workers.get(taskId);
    if (worker) {
      // 终止工作线程
      worker.terminate().catch(console.error);
      this.workers.delete(taskId);
      this.activeWorkers--;
    }
  }
  
  /**
   * 等待所有任务完成
   */
  public async waitForAllTasks(): Promise<void> {
    // 如果没有活动的工作线程且队列为空，则直接返回
    if (this.activeWorkers === 0 && this.taskQueue.length === 0) {
      return Promise.resolve();
    }
    
    // 等待所有工作线程完成
    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.activeWorkers === 0 && this.taskQueue.length === 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
  
  /**
   * 翻译内容块
   * @param chunks 内容块数组
   * @param colKey 列键
   * @param baseRequest 基础翻译请求
   * @returns 翻译后的内容块数组
   */
  public async translateChunks(
    chunks: ContentChunk[], 
    colKey: string, 
    baseRequest: TranslationRequest
  ): Promise<ContentChunk[]> {
    // 如果只有一个块或非常少的块，不使用并发
    if (chunks.length <= 1) {
      const chunk = chunks[0];
      const result = await this.submitChunkTask(chunk, colKey, baseRequest);
      return [{ ...chunk, content: result.translatedContent as string }];
    }
    
    // 提交所有块任务
    const chunkPromises = chunks.map(chunk => 
      this.submitChunkTask(chunk, colKey, baseRequest)
        .then(result => ({
          ...chunk,
          content: result.translatedContent as string
        }))
        .catch(error => {
          console.error(`块 ${chunk.id} 翻译失败:`, error);
          // 返回原始块，避免整个翻译过程失败
          return chunk;
        })
    );
    
    // 等待所有块任务完成
    return Promise.all(chunkPromises);
  }
} 