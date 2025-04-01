import { extractData } from './extract-data';
import { saveToJson } from './save-to-json';
import { readFromJson } from './read-from-json';
import { rebuildExcel } from './rebuild-excel';
import { ExcelData } from '../../models/types';
import { readExcel } from './read-excel';
import { writeTranslatedData } from './write-excel';
import { ExcelProcessResult } from '../../models/types';

/**
 * Excel处理服务
 */
export class ExcelService {
  /**
   * 从Excel文件中提取数据
   * @param filePath Excel文件路径
   * @returns 提取的Excel数据
   */
  public async extractData(filePath: string): Promise<ExcelData> {
    return extractData(filePath);
  }
  
  /**
   * 保存Excel数据到JSON文件
   * @param data Excel数据
   * @param filePath 目标文件路径
   * @param cleanData 是否清理注释内容
   */
  public saveToJson(data: ExcelData, filePath: string, cleanData: boolean = false): void {
    saveToJson(data, filePath, cleanData);
  }
  
  /**
   * 从JSON文件中读取Excel数据
   * @param filePath JSON文件路径
   * @returns Excel数据
   */
  public readFromJson(filePath: string): ExcelData {
    return readFromJson(filePath);
  }
  
  /**
   * 重构Excel文件
   * @param data 翻译后的Excel数据
   * @param originalFilePath 原始Excel文件路径
   * @param outputFilePath 输出Excel文件路径
   */
  public async rebuildExcel(
    data: ExcelData,
    originalFilePath: string,
    outputFilePath: string
  ): Promise<void> {
    return rebuildExcel(data, originalFilePath, outputFilePath);
  }

  /**
   * 读取Excel文件
   * @param filePath 文件路径
   * @returns Excel数据
   */
  public async readExcel(filePath: string): Promise<Record<string, string>[]> {
    return readExcel(filePath);
  }
  
  /**
   * 写入翻译后的数据到Excel
   * @param sourceFilePath 源文件路径
   * @param translatedData 翻译后的数据
   * @param targetFolder 目标文件夹
   * @returns 处理结果
   */
  public async writeTranslatedData(
    sourceFilePath: string,
    translatedData: Record<string, string>[],
    targetFolder: string
  ): Promise<ExcelProcessResult> {
    return writeTranslatedData(sourceFilePath, translatedData, targetFolder);
  }
} 