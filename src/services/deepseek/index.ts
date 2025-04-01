/**
 * DeepSeek 模块导出文件
 */
import { analyzeExcelTopic } from './analyze-topic';
import { translateContent } from './translate-content';
import { createDeepSeekClient, getModelName } from './client';
import { 
  SYSTEM_PROMPT, 
  buildTranslationPrompt, 
  extractColumnHeaderFromContext 
} from './prompts';
import { TranslationRequest, TranslationResult, TopicAnalysisResult } from '../../models/types';

/**
 * DeepSeek API服务
 */
export class DeepSeekService {
  /**
   * 分析Excel表格主题
   * @param headers 表头数据
   * @returns 主题分析结果
   */
  public async analyzeExcelTopic(headers: Record<string, string>): Promise<TopicAnalysisResult> {
    return analyzeExcelTopic(headers);
  }
  
  /**
   * 翻译内容
   * @param request 翻译请求
   * @returns 翻译结果
   */
  public async translateContent(request: TranslationRequest): Promise<TranslationResult> {
    return translateContent(request);
  }
}

// 导出各模块功能
export {
  translateContent,
  analyzeExcelTopic,
  createDeepSeekClient,
  getModelName,
  SYSTEM_PROMPT,
  buildTranslationPrompt,
  extractColumnHeaderFromContext
}; 