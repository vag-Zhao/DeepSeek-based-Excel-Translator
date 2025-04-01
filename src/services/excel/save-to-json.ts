import * as fs from 'fs';
import * as path from 'path';
import { ExcelData } from '../../models/types';
import { cleanTranslationData, ensureDirectoryExists } from '../../utils/file-utils';

/**
 * 保存Excel数据到JSON文件
 * @param data Excel数据
 * @param filePath 目标文件路径
 * @param cleanData 是否清理注释内容
 */
export function saveToJson(data: ExcelData, filePath: string, cleanData: boolean = false): void {
  const dirPath = path.dirname(filePath);
  
  // 确保目录存在
  ensureDirectoryExists(dirPath);
  
  // 如果需要清理数据，先清理注释内容
  const finalData = cleanData ? cleanTranslationData(data) : data;
  
  fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf8');
} 