import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { ExcelData } from '../../models/types';

/**
 * 从CSV文件中提取数据
 * @param filePath CSV文件路径
 * @returns 提取的Excel数据
 */
async function extractDataFromCsv(filePath: string): Promise<ExcelData> {
  const workbook = new ExcelJS.Workbook();
  
  try {
    // 使用ExcelJS的CSV解析功能
    await workbook.csv.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('无法解析CSV工作表');
    }
    
    const headers: Record<string, string> = {};
    const columns: Record<string, string[]> = {};
    
    // 获取列数
    const columnCount = worksheet.actualColumnCount;
    
    // 提取表头（第一行）
    const headerRow = worksheet.getRow(1);
    
    for (let colNum = 1; colNum <= columnCount; colNum++) {
      const colKey = `column${colNum}`;
      const headerCell = headerRow.getCell(colNum);
      headers[colKey] = headerCell.text || '';
      
      // 为每列初始化一个空数组
      columns[colKey] = [];
    }
    
    // 提取每列的数据（从第二行开始）
    const rowCount = worksheet.actualRowCount;
    
    for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum);
      
      for (let colNum = 1; colNum <= columnCount; colNum++) {
        const colKey = `column${colNum}`;
        const cell = row.getCell(colNum);
        if (cell.text) {
          columns[colKey].push(cell.text);
        }
      }
    }
    
    return {
      headers,
      columns
    };
  } catch (error) {
    console.error('CSV解析失败:', error);
    throw new Error(`无法解析CSV文件: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 从Excel或CSV文件中提取数据
 * @param filePath 文件路径
 * @returns 提取的数据
 */
export async function extractData(filePath: string): Promise<ExcelData> {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  // 根据文件扩展名选择处理方法
  if (fileExtension === '.csv') {
    console.log('检测到CSV文件，使用CSV解析方法...');
    return extractDataFromCsv(filePath);
  } else {
    console.log('检测到Excel文件，使用Excel解析方法...');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1); // 获取第一个工作表
    if (!worksheet) {
      throw new Error('无法找到工作表');
    }
    
    const headers: Record<string, string> = {};
    const columns: Record<string, string[]> = {};
    
    // 获取列数
    const columnCount = worksheet.actualColumnCount;
    
    // 提取表头（第一行）
    const headerRow = worksheet.getRow(1);
    
    for (let colNum = 1; colNum <= columnCount; colNum++) {
      const colKey = `column${colNum}`;
      const headerCell = headerRow.getCell(colNum);
      headers[colKey] = headerCell.text || '';
      
      // 为每列初始化一个空数组
      columns[colKey] = [];
    }
    
    // 提取每列的数据（从第二行开始）
    const rowCount = worksheet.actualRowCount;
    
    for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum);
      
      for (let colNum = 1; colNum <= columnCount; colNum++) {
        const colKey = `column${colNum}`;
        const cell = row.getCell(colNum);
        if (cell.text) {
          columns[colKey].push(cell.text);
        }
      }
    }
    
    return {
      headers,
      columns
    };
  }
} 