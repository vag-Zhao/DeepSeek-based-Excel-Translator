import { Worker } from 'worker_threads';
import path from 'path';
import os from 'os';
import { TranslationRequest, TranslationResult } from '../../models/types';

// 获取CPU核心数，用于限制最大并发数
const MAX_CONCURRENT_WORKERS = Math.max(2, os.cpus().length - 1);

/**
 * 工作线程管理器，用于管理并发翻译任务
 */
export class WorkerManager {
  private workers: Map<string, Worker> = new Map();
  private activeWorkers: number = 0;
  private taskQueue: Array<{
    colKey: string;
    request: TranslationRequest;
    resolve: (result: TranslationResult) => void;
    reject: (error: Error) => void;
  }> = [];

  /**
   * 提交翻译任务
   * @param colKey 列键，用于标识任务
   * @param request 翻译请求
   * @returns 翻译结果Promise
   */
  public submitTask(colKey: string, request: TranslationRequest): Promise<TranslationResult> {
    return new Promise((resolve, reject) => {
      // 将任务添加到队列
      this.taskQueue.push({ colKey, request, resolve, reject });
      // 尝试处理队列中的任务
      this.processQueue();
    });
  }

  /**
   * 处理队列中的任务
   */
  private processQueue(): void {
    // 如果队列为空或已达到最大并发数，则不处理
    if (this.taskQueue.length === 0 || this.activeWorkers >= MAX_CONCURRENT_WORKERS) {
      return;
    }

    // 从队列中取出一个任务
    const task = this.taskQueue.shift();
    if (!task) return;

    const { colKey, request, resolve, reject } = task;
    
    // 创建新的工作线程
    try {
      this.activeWorkers++;
      
      // 创建工作线程
      const worker = new Worker(
        path.resolve(__dirname, 'translation-worker.js'), 
        { 
          workerData: { 
            colKey, 
            request 
          } 
        }
      );

      // 存储工作线程
      this.workers.set(colKey, worker);

      // 处理工作线程的消息
      worker.on('message', (result: TranslationResult & { colKey: string; chunkCount?: number }) => {
        // 释放工作线程
        this.releaseWorker(colKey);
        
        // 处理结果
        if (result.success) {
          resolve({
            translatedContent: result.translatedContent,
            success: true,
            chunkCount: result.chunkCount
          });
        } else {
          reject(new Error(result.error || '翻译失败'));
        }
        
        // 继续处理队列中的下一个任务
        this.processQueue();
      });

      // 处理工作线程的错误
      worker.on('error', (error) => {
        this.releaseWorker(colKey);
        reject(error);
        this.processQueue();
      });

      // 处理工作线程的退出
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`工作线程以退出码 ${code} 退出`));
        }
        this.releaseWorker(colKey);
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
   * @param colKey 列键
   */
  private releaseWorker(colKey: string): void {
    const worker = this.workers.get(colKey);
    if (worker) {
      // 终止工作线程
      worker.terminate().catch(console.error);
      this.workers.delete(colKey);
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
} 