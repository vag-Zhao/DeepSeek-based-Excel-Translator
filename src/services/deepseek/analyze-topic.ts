import { OpenAI } from 'openai';
import { TopicAnalysisResult } from '../../models/types';
import { createDeepSeekClient, getModelName } from './client';

/**
 * 分析Excel表格主题
 * @param headers 表头数据
 * @returns 主题分析结果
 */
export async function analyzeExcelTopic(headers: Record<string, string>): Promise<TopicAnalysisResult> {
  try {
    const client = createDeepSeekClient();
    const model = getModelName();
    
    const headerValues = Object.values(headers).filter(value => value.trim().length > 0);
    
    if (headerValues.length === 0) {
      return {
        topic: '未知主题',
        success: false,
        error: '表头为空，无法分析主题'
      };
    }
    
    const prompt = `请根据以下Excel表格列标题，根据标题匹配专业性属性，分析出这个表格的主要主题或用途，直接返回一个简洁的主题名称，不要有任何额外的解释：\n${headerValues.join(', ')}`;
    
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: '你是一个专业的数据分析助手。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });
    
    const topic = response.choices[0]?.message?.content?.trim() || '未知主题';
    
    return {
      topic,
      success: true
    };
  } catch (error) {
    console.error('分析主题失败:', error);
    return {
      topic: '未知主题',
      success: false,
      error: `分析主题错误: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 