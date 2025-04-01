import { Services } from '../../index';
import { ExcelData } from '../../../models/types';
import * as path from 'path';

/**
 * 保存翻译结果
 * @param translatedData 翻译后的数据
 * @param outputDir 输出目录
 * @param baseFileName 基本文件名
 * @param originalFilePath 原始文件路径
 */
export async function saveTranslationResults(
  translatedData: ExcelData,
  outputDir: string,
  baseFileName: string,
  originalFilePath: string
): Promise<void> {
  const services = Services.getInstance();
  
  // 保存翻译后的数据到JSON文件 - 启用清理功能以移除注释
  const translatedJsonPath = path.join(outputDir, `${baseFileName}-columns-translate.json`);
  services.excelService.saveToJson(translatedData, translatedJsonPath, true);
  console.log(`翻译后的数据已保存到: ${translatedJsonPath}`);
  
  // 获取原始文件扩展名
  const fileExtension = path.extname(originalFilePath).toLowerCase();
  const isCSV = fileExtension === '.csv';
  
  // 重构文件（保持与原始文件相同的格式）
  const translatedFilePath = path.join(
    outputDir, 
    `${baseFileName}-translated${fileExtension}`
  );
  await services.excelService.rebuildExcel(translatedData, originalFilePath, translatedFilePath);
  
  // 根据文件类型输出不同的消息
  if (isCSV) {
    console.log(`翻译后的CSV文件已保存到: ${translatedFilePath}`);
  } else {
    console.log(`翻译后的Excel文件已保存到: ${translatedFilePath}`);
  }
} 