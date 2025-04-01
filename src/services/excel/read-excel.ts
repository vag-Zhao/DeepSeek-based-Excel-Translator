import * as ExcelJS from 'exceljs';

/**
 * 读取Excel文件
 * @param filePath Excel文件路径
 * @returns 将Excel文件读取为对象数组
 */
export async function readExcel(filePath: string): Promise<Record<string, string>[]> {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) {
      throw new Error('无法找到工作表');
    }
    
    const result: Record<string, string>[] = [];
    
    // 获取表头
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    
    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      headers[colNumber - 1] = cell.text || `column${colNumber}`;
    });
    
    // 处理每一行数据
    worksheet.eachRow((row, rowNumber) => {
      // 跳过表头行
      if (rowNumber > 1) {
        const rowData: Record<string, string> = {};
        
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          const header = headers[colNumber - 1];
          rowData[header] = cell.text || '';
        });
        
        // 如果行不为空，添加到结果集
        if (Object.keys(rowData).length > 0) {
          result.push(rowData);
        }
      }
    });
    
    // 将表头作为第一个元素
    const headerObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      headerObject[`column${index + 1}`] = header;
    });
    
    result.unshift(headerObject);
    
    return result;
  } catch (error) {
    console.error('读取Excel文件失败:', error);
    throw new Error(`读取Excel文件失败: ${error instanceof Error ? error.message : String(error)}`);
  }
} 