/**
 * DeepSeek 客户端模块
 * 负责管理与 DeepSeek API 的连接
 */
import { OpenAI } from 'openai';
import { getDeepSeekConfig, getModelName, getTemperature } from './config';

/**
 * 创建 DeepSeek API 客户端
 * @returns 初始化后的 DeepSeek API 客户端
 */
export function createDeepSeekClient(): OpenAI {
  const config = getDeepSeekConfig();
  
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl
  });
}

/**
 * 创建标准 API 请求选项
 * @returns API 请求选项
 */
export function createRequestOptions(): {
  model: string;
  temperature: number;
} {
  return {
    model: getModelName(),
    temperature: getTemperature()
  };
}

// 重新导出配置模块的函数
export { getModelName } from './config'; 