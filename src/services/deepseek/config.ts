/**
 * DeepSeek 配置模块
 * 负责管理 DeepSeek API 的配置参数
 */
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * DeepSeek API 配置接口
 */
export interface DeepSeekConfig {
  /** API 密钥 */
  apiKey: string;
  /** API 基本 URL */
  baseUrl: string;
  /** 模型名称 */
  modelName: string;
  /** 会话温度值 (0-1) */
  temperature: number;
}

/**
 * 获取 DeepSeek API 配置参数
 * @returns DeepSeek 配置对象
 * @throws 如果缺少必要的环境变量
 */
export function getDeepSeekConfig(): DeepSeekConfig {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_API_BASE_URL;
  const modelName = process.env.DEEPSEEK_MODEL_NAME || 'deepseek-chat';
  const temperatureStr = process.env.DEEPSEEK_TEMPERATURE || '0.2';
  
  if (!apiKey || !baseUrl) {
    throw new Error('DeepSeek API配置缺失，请检查环境变量');
  }
  
  // 验证并解析温度值
  const temperature = Number(temperatureStr);
  if (isNaN(temperature) || temperature < 0 || temperature > 1) {
    throw new Error(`DeepSeek API温度值无效: ${temperatureStr}，必须是0到1之间的数值`);
  }
  
  return {
    apiKey,
    baseUrl,
    modelName,
    temperature
  };
}

/**
 * 获取 DeepSeek 模型名称
 * @returns 配置的模型名称
 */
export function getModelName(): string {
  return getDeepSeekConfig().modelName;
}

/**
 * 获取 DeepSeek 会话温度值
 * @returns 配置的温度值
 */
export function getTemperature(): number {
  return getDeepSeekConfig().temperature;
} 