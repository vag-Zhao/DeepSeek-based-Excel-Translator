import { Services } from '../../index';
import * as path from 'path';
import { ExcelData } from '../../../models/types';
import { ensureDirectoryExists } from '../../../utils/file-utils';

/**
 * 提取Excel数据并保存到JSON文件
 * @param excelFilePath Excel文件路径
 * @returns 提取的Excel数据和创建的输出目录
 */
export async function extractExcelData(excelFilePath: string): Promise<{
  excelData: ExcelData;
  outputDir: string;
  baseFileName: string;
}> {
  const services = Services.getInstance();
  
  // 提取Excel数据
  const excelData = await services.excelService.extractData(excelFilePath);
  
  // 创建输出目录
  const outputDir = path.join(path.dirname(excelFilePath), 'output');
  ensureDirectoryExists(outputDir);
  
  const baseFileName = path.basename(excelFilePath, path.extname(excelFilePath));
  
  // 保存提取的headers到JSON文件
  const headersJsonPath = path.join(outputDir, `${baseFileName}-headers.json`);
  services.excelService.saveToJson({ headers: excelData.headers }, headersJsonPath);
  console.log(`表头数据已保存到: ${headersJsonPath}`);
  
  // 保存完整的数据到JSON文件
  const columnsJsonPath = path.join(outputDir, `${baseFileName}-columns.json`);
  services.excelService.saveToJson(excelData, columnsJsonPath);
  console.log(`列数据已保存到: ${columnsJsonPath}`);
  
  return { excelData, outputDir, baseFileName };
} 