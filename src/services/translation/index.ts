import { extractExcelData } from './process/extract-excel';
import { analyzeAndConfirmTopic } from './process/analyze-topic';
import { translateHeaders } from './process/translate-headers';
import { translateColumns } from './process/translate-columns';
import { saveTranslationResults } from './process/save-results';
import { closeReadline } from './ui/user-input';

/**
 * 格式化时间
 * @param milliseconds 毫秒数
 * @returns 格式化后的时间字符串
 */
function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const remainingMilliseconds = milliseconds % 1000;
  
  if (minutes > 0) {
    return `${minutes}分${remainingSeconds}.${remainingMilliseconds}秒`;
  } else {
    return `${seconds}.${remainingMilliseconds}秒`;
  }
}

/**
 * 翻译服务
 */
export class TranslationService {
  /**
   * 关闭服务
   */
  public close(): void {
    closeReadline();
  }
  
  /**
   * 处理Excel翻译
   * @param excelFilePath Excel文件路径
   * @returns 处理成功或失败
   */
  public async processExcelTranslation(excelFilePath: string): Promise<boolean> {
    try {
      console.log('开始处理Excel文件...');
      const totalStartTime = Date.now();
      let stepStartTime = totalStartTime;
      let stepEndTime: number;
      
      // 步骤1: 提取Excel数据
      console.log('步骤1: 提取Excel数据...');
      const { excelData, outputDir, baseFileName } = await extractExcelData(excelFilePath);
      stepEndTime = Date.now();
      console.log(`提取Excel数据完成，耗时: ${formatTime(stepEndTime - stepStartTime)}`);
      
      // 步骤2: 分析Excel主题
      console.log('步骤2: 分析Excel主题...');
      stepStartTime = Date.now();
      const topic = await analyzeAndConfirmTopic(excelData.headers);
      stepEndTime = Date.now();
      console.log(`分析Excel主题完成，耗时: ${formatTime(stepEndTime - stepStartTime)}`);
      
      // 步骤3: 翻译表头
      console.log('步骤3: 翻译表头...');
      stepStartTime = Date.now();
      let translatedData = await translateHeaders(excelData, topic);
      stepEndTime = Date.now();
      console.log(`翻译表头完成，耗时: ${formatTime(stepEndTime - stepStartTime)}`);
      
      // 步骤4: 翻译列数据
      console.log('步骤4: 翻译列数据...');
      stepStartTime = Date.now();
      translatedData = await translateColumns(translatedData, topic);
      stepEndTime = Date.now();
      console.log(`翻译列数据完成，耗时: ${formatTime(stepEndTime - stepStartTime)}`);
      
      // 步骤5: 保存翻译结果
      console.log('步骤5: 保存翻译结果...');
      stepStartTime = Date.now();
      await saveTranslationResults(translatedData, outputDir, baseFileName, excelFilePath);
      stepEndTime = Date.now();
      console.log(`保存翻译结果完成，耗时: ${formatTime(stepEndTime - stepStartTime)}`);
      
      // 输出总运行时间
      const totalEndTime = Date.now();
      const totalTime = totalEndTime - totalStartTime;
      console.log(`===================================`);
      console.log(`翻译处理完成！总耗时: ${formatTime(totalTime)}`);
      console.log(`===================================`);
      
      return true;
    } catch (error) {
      console.error('处理Excel翻译时出错:', error);
      return false;
    }
  }
} 