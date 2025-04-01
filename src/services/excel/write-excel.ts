import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { ExcelProcessResult } from '../../models/types';
import { ensureDirectoryExists, getFileNameWithoutExtension } from '../../utils/file-utils';

/**
 * 将翻译后的数据写入Excel文件
 * @param sourceFilePath 源Excel文件路径
 * @param translatedData 翻译后的数据
 * @param targetFolder 目标文件夹
 * @returns Excel处理结果
 */
export async function writeTranslatedData(
  sourceFilePath: string,
  translatedData: Record<string, string>[],
  targetFolder: string
): Promise<ExcelProcessResult> {
  try {
    // 确保目标目录存在
    ensureDirectoryExists(targetFolder);
    
    // 构建输出文件路径
    const baseName = getFileNameWithoutExtension(sourceFilePath);
    const extension = path.extname(sourceFilePath);
    const outputFilePath = path.join(targetFolder, `${baseName}-translated${extension}`);
    
    // 创建新Excel工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('翻译结果');
    
    // 检查数据是否为空
    if (!translatedData || translatedData.length === 0) {
      return {
        success: false,
        error: '翻译后的数据为空',
        message: '翻译后的数据为空，无法写入Excel文件'
      };
    }
    
    // 获取所有列名
    const headers = Object.keys(translatedData[0]);
    
    // 添加表头
    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: 20
    }));
    
    // 添加数据行
    for (const row of translatedData) {
      worksheet.addRow(row);
    }
    
    // 设置样式
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    
    // 保存工作簿
    await workbook.xlsx.writeFile(outputFilePath);
    
    return {
      success: true,
      outputFilePath,
      message: `翻译后的Excel文件已保存到: ${outputFilePath}`
    };
  } catch (error) {
    console.error('写入Excel文件失败:', error);
    return {
      success: false,
      error: `写入Excel文件失败: ${error instanceof Error ? error.message : String(error)}`,
      message: '写入Excel文件时发生错误'
    };
  }
} 