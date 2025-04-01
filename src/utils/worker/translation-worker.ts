import { parentPort, workerData } from 'worker_threads';
import { createDeepSeekClient, createRequestOptions } from '../../services/deepseek/client';
import { TranslationRequest, TranslationResult } from '../../models/types';
import * as dotenv from 'dotenv';
import * as os from 'os';
import { 
  SYSTEM_PROMPT, 
  buildTranslationPrompt, 
  extractColumnHeaderFromContext 
} from './worker-prompt';
import {
  splitContentIntoLines,
  joinLinesToContent,
  validateLineCount,
  collectUniqueContents,
  applyTranslationsToAllPositions,
  processContent,
  splitContentIntoChunks,
  mergeChunkResults
} from './content-processor';
import { ChunkWorkerManager } from './chunk-worker-manager';

// 确保在工作线程中也能加载环境变量
dotenv.config();

// 决定每列使用的最大分块数量
// 使用CPU核心数-1，确保至少有1个
const CPU_CORES = os.cpus().length;
const MAX_CHUNKS_PER_COLUMN = Math.max(1, Math.min(CPU_CORES - 1, 4));

/**
 * 工作线程中的翻译处理函数
 */
async function translateInWorker(): Promise<void> {
  if (!parentPort || !workerData) {
    throw new Error('工作线程缺少必要的通信端口或数据');
  }
  
  try {
    const request: TranslationRequest = workerData.request;
    const { content, context } = request;
    const colKey = workerData.colKey;
    
    // 获取列标题
    const columnHeader = extractColumnHeaderFromContext(context, colKey);
    
    // 处理内容为对象的情况
    const contentToTranslate = processContent(content);
    
    // 将内容按行分割
    const contentLines = splitContentIntoLines(contentToTranslate);
    const translatedLines: string[] = new Array(contentLines.length);
    
    // 优先处理内容很少的情况，避免不必要的并发开销
    if (contentLines.length <= 5) {
      // 翻译整个内容
      const fullPrompt = buildTranslationPrompt(contentToTranslate, context);
      const client = createDeepSeekClient();
      const requestOptions = createRequestOptions();
      
      const response = await client.chat.completions.create({
        ...requestOptions,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fullPrompt }
        ]
      });
      
      const translatedContent = response.choices[0]?.message?.content?.trim() || '';
      const translated = splitContentIntoLines(translatedContent);
      
      // 确保翻译结果行数与原内容一致
      validateLineCount(translated, contentLines);
      
      // 将结果发送回主线程
      parentPort.postMessage({
        success: true,
        translatedContent: translatedContent,
        colKey: colKey,
        chunkCount: 1 // 单块处理
      });
      return;
    }
    
    // 收集唯一内容以减少重复翻译
    const { uniqueContents, uniqueIndexMap } = collectUniqueContents(contentLines);
    
    // 针对唯一内容数量决定是否使用多级并发
    if (uniqueContents.length <= 10) {
      // 对于较少的唯一内容，直接翻译
      const uniqueContentText = joinLinesToContent(uniqueContents);
      const prompt = buildTranslationPrompt(uniqueContentText, context);
      
      const client = createDeepSeekClient();
      const requestOptions = createRequestOptions();
      
      const response = await client.chat.completions.create({
        ...requestOptions,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ]
      });
      
      const translatedUniqueContent = response.choices[0]?.message?.content?.trim() || '';
      const translatedUniqueLines = splitContentIntoLines(translatedUniqueContent);
      
      // 确保翻译结果行数与原内容一致
      validateLineCount(translatedUniqueLines, uniqueContents);
      
      // 将翻译结果应用到所有位置
      applyTranslationsToAllPositions(
        translatedLines,
        uniqueContents,
        uniqueIndexMap,
        translatedUniqueLines
      );
      
      // 将结果发送回主线程
      parentPort.postMessage({
        success: true,
        translatedContent: joinLinesToContent(translatedLines),
        colKey: colKey,
        chunkCount: 1 // 单块处理
      });
      return;
    }
    
    // 使用多级并发处理大量内容
    // 1. 确定合适的分块数量
    const chunkCount = Math.min(
      MAX_CHUNKS_PER_COLUMN, 
      Math.ceil(uniqueContents.length / 15) // 每块大约15行
    );
    
    // 2. 将唯一内容分成多个块
    const uniqueContentText = joinLinesToContent(uniqueContents);
    const uniqueContentLines = splitContentIntoLines(uniqueContentText);
    const chunks = splitContentIntoChunks(uniqueContentLines, chunkCount);
    
    console.log(`列 ${colKey} 被分成 ${chunks.length} 个块进行并行处理`);
    
    // 3. 创建块工作线程管理器
    const chunkManager = new ChunkWorkerManager();
    
    // 4. 并行翻译所有块
    const translatedChunks = await chunkManager.translateChunks(
      chunks,
      colKey,
      { ...request, context }
    );
    
    // 5. 合并翻译结果
    const translatedUniqueLines = mergeChunkResults(translatedChunks, uniqueContentLines.length);
    
    // 6. 确保翻译结果行数与原始唯一内容行数一致
    if (translatedUniqueLines.length !== uniqueContents.length) {
      throw new Error(`翻译结果行数(${translatedUniqueLines.length})与唯一内容行数(${uniqueContents.length})不匹配`);
    }
    
    // 7. 将翻译结果应用到所有位置
    applyTranslationsToAllPositions(
      translatedLines,
      uniqueContents,
      uniqueIndexMap,
      translatedUniqueLines
    );
    
    // 8. 将结果发送回主线程
    parentPort.postMessage({
      success: true,
      translatedContent: joinLinesToContent(translatedLines),
      colKey: colKey,
      chunkCount: chunks.length
    });
  } catch (error) {
    // 错误处理
    parentPort.postMessage({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      colKey: workerData?.colKey
    });
  }
}

// 执行工作线程的翻译函数
translateInWorker().catch(error => {
  if (parentPort) {
    parentPort.postMessage({
      success: false,
      error: `工作线程执行错误: ${error instanceof Error ? error.message : String(error)}`,
      colKey: workerData?.colKey
    });
  }
}); 