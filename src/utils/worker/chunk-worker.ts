import { parentPort, workerData } from 'worker_threads';
import { createDeepSeekClient, createRequestOptions } from '../../services/deepseek/client';
import { TranslationRequest, TranslationResult } from '../../models/types';
import * as dotenv from 'dotenv';
import { 
  SYSTEM_PROMPT, 
  buildTranslationPrompt 
} from './worker-prompt';

// 确保在工作线程中也能加载环境变量
dotenv.config();

/**
 * 工作线程中的块翻译处理函数
 */
async function translateChunkInWorker(): Promise<void> {
  if (!parentPort || !workerData) {
    throw new Error('工作线程缺少必要的通信端口或数据');
  }
  
  try {
    const request: TranslationRequest = workerData.request;
    const { content, context } = request;
    const chunkId = workerData.chunkId;
    const colKey = workerData.colKey;
    
    // 处理内容为对象的情况
    const contentToTranslate = typeof content === 'string' ? content : JSON.stringify(content);
    
    // 构建翻译提示词
    const prompt = buildTranslationPrompt(contentToTranslate, context);
    
    // 初始化客户端
    const client = createDeepSeekClient();
    const requestOptions = createRequestOptions();
    
    // 调用API
    const response = await client.chat.completions.create({
      ...requestOptions,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    });
    
    const translatedContent = response.choices[0]?.message?.content?.trim() || '';
    
    // 将结果发送回主工作线程
    parentPort.postMessage({
      success: true,
      translatedContent,
      chunkId,
      colKey
    });
  } catch (error) {
    // 错误处理
    parentPort.postMessage({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      chunkId: workerData.chunkId,
      colKey: workerData.colKey,
      translatedContent: ''
    });
  }
}

// 执行工作线程的翻译函数
translateChunkInWorker().catch(error => {
  if (parentPort) {
    parentPort.postMessage({
      success: false,
      error: `块工作线程执行错误: ${error instanceof Error ? error.message : String(error)}`,
      chunkId: workerData?.chunkId,
      colKey: workerData?.colKey,
      translatedContent: ''
    });
  }
}); 