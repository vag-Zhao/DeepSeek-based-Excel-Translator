import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { ExcelData } from '../../models/types';
import { cleanTranslationData } from '../../utils/file-utils';

/**
 * 重构Excel或CSV文件
 * @param data 翻译后的数据
 * @param originalFilePath 原始文件路径
 * @param outputFilePath 输出文件路径
 */
export async function rebuildExcel(
  data: ExcelData,
  originalFilePath: string,
  outputFilePath: string
): Promise<void> {
  // 清理翻译数据中的注释内容
  const cleanedData = cleanTranslationData(data);
  
  // 创建新的工作簿和工作表
  const newWorkbook = new ExcelJS.Workbook();
  const newWorksheet = newWorkbook.addWorksheet('翻译结果');
  
  // 设置表头
  const headerRow = newWorksheet.getRow(1);
  for (const [colKey, headerValue] of Object.entries(cleanedData.headers)) {
    const colNum = parseInt(colKey.replace('column', ''), 10);
    headerRow.getCell(colNum).value = headerValue;
  }
  headerRow.commit();
  
  // 填充翻译后的数据
  if (cleanedData.translatedColumns) {
    const columnKeys = Object.keys(cleanedData.translatedColumns);
    
    // 确保所有列的长度一致，取源数据的长度
    const originalColumnLengths: Record<string, number> = {};
    
    if (cleanedData.columns) {
      Object.entries(cleanedData.columns).forEach(([colKey, columnData]) => {
        originalColumnLengths[colKey] = columnData.length;
      });
    }
    
    // 计算每列的最大行数，使用原始列长度而不是翻译后的列长度
    const maxRowsPerColumn = Math.max(
      ...columnKeys.map(key => {
        return originalColumnLengths[key] || cleanedData.translatedColumns![key].length;
      })
    );
    
    for (let rowNum = 0; rowNum < maxRowsPerColumn; rowNum++) {
      const dataRow = newWorksheet.getRow(rowNum + 2); // 从第二行开始
      
      for (const [colKey, columnData] of Object.entries(cleanedData.translatedColumns)) {
        const colNum = parseInt(colKey.replace('column', ''), 10);
        if (rowNum < columnData.length) {
          dataRow.getCell(colNum).value = columnData[rowNum];
        }
      }
      
      dataRow.commit();
    }
  }
  
  // 根据输出文件的扩展名决定输出格式
  const fileExtension = path.extname(outputFilePath).toLowerCase();
  console.log(`准备输出到文件: ${outputFilePath} (格式: ${fileExtension})`);
  
  if (fileExtension === '.csv') {
    // 保存为CSV文件
    await newWorkbook.csv.writeFile(outputFilePath);
    console.log('已保存为CSV格式');
  } else {
    // 保存为Excel文件
    await newWorkbook.xlsx.writeFile(outputFilePath);
    console.log('已保存为Excel格式');
  }
} 