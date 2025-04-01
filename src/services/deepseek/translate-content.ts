import { TranslationRequest, TranslationResult } from '../../models/types';
import { createDeepSeekClient, createRequestOptions } from './client';
import { SYSTEM_PROMPT, buildTranslationPrompt } from './prompts';

/**
 * 翻译内容
 * @param request 翻译请求
 * @returns 翻译结果
 */
export async function translateContent(request: TranslationRequest): Promise<TranslationResult> {
  try {
    const client = createDeepSeekClient();
    const requestOptions = createRequestOptions();
    const { content, context } = request;
    
    // 处理内容为对象的情况
    const contentToTranslate = typeof content === 'string' 
      ? content 
      : JSON.stringify(content);
    
    const prompt = buildTranslationPrompt(contentToTranslate, context);
    
    const response = await client.chat.completions.create({
      ...requestOptions,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    });
    
    const translatedContent = response.choices[0]?.message?.content?.trim() || '';
    
    return {
      translatedContent,
      success: true
    };
  } catch (error) {
    console.error('翻译失败:', error);
    return {
      translatedContent: '',
      success: false,
      error: `翻译错误: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 