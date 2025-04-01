import { Services } from '../../index';
import { TopicAnalysisResult } from '../../../models/types';
import { getUserConfirmation } from '../ui/user-input';

/**
 * 分析Excel主题并获取用户确认
 * @param headers Excel表头数据
 * @returns 确认后的主题
 */
export async function analyzeAndConfirmTopic(headers: Record<string, string>): Promise<string> {
  const services = Services.getInstance();
  
  console.log('正在分析Excel表格主题...');
  const topicResult: TopicAnalysisResult = await services.deepSeekService.analyzeExcelTopic(headers);
  
  let topic = '';
  
  if (topicResult.success) {
    console.log(`AI分析的Excel主题是: ${topicResult.topic}`);
    
    // 让用户确认或修改主题
    topic = await getUserConfirmation(
      `请确认这个主题是否正确? 输入新的主题或按回车确认 [${topicResult.topic}]: `,
      topicResult.topic
    );
  } else {
    console.warn(`主题分析失败: ${topicResult.error}`);
    topic = await getUserConfirmation('请手动输入Excel表格的主题: ', '未知主题');
  }
  
  console.log(`确认的主题是: ${topic}`);
  return topic;
} 