import * as fs from 'fs';
import { ExcelData } from '../../models/types';

/**
 * 从JSON文件中读取Excel数据
 * @param filePath JSON文件路径
 * @returns Excel数据
 */
export function readFromJson(filePath: string): ExcelData {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData) as ExcelData;
} 