/**
 * 列处理模块 - 处理列数据的翻译相关逻辑
 */
import { ExcelData, TranslationResult } from '../../../models/types';

/**
 * 处理单个列的翻译结果
 * @param translatedData 翻译数据对象
 * @param colKey 列键
 * @param columnHeader 列标题
 * @param column 原始列数据
 * @param translationResult 翻译结果
 */
export function processColumnTranslationResult(
  translatedData: ExcelData,
  colKey: string,
  columnHeader: string | undefined,
  column: string[],
  translationResult: TranslationResult
): void {
  if (translationResult.success && typeof translationResult.translatedContent === 'string') {
    // 将翻译结果拆分回数组
    const translatedColumnData = translationResult.translatedContent.split('\n');
    
    // 确保翻译后的数据长度与原始数据长度相同
    if (translatedColumnData.length === column.length) {
      translatedData.translatedColumns![colKey] = translatedColumnData;
    } else {
      console.warn(`列 ${columnHeader || colKey} 的翻译结果行数与原始数据不匹配，保留最接近原始长度的行数`);
      
      // 如果翻译结果行数超过原始数据，只取前面部分
      if (translatedColumnData.length > column.length) {
        translatedData.translatedColumns![colKey] = translatedColumnData.slice(0, column.length);
      } else {
        // 如果翻译结果行数不够，使用翻译结果并补充空字符串
        translatedData.translatedColumns![colKey] = [
          ...translatedColumnData,
          ...new Array(column.length - translatedColumnData.length).fill('')
        ];
      }
    }
  } else {
    console.error(`翻译列 ${columnHeader || colKey} 失败: ${translationResult.error || translationResult.message || '未知错误'}`);
    // 如果翻译失败，使用原始数据
    translatedData.translatedColumns![colKey] = [...column];
  }
}

/**
 * 准备列数据用于翻译
 * @param column 列数据
 * @returns 合并后的列内容文本
 */
export function prepareColumnContent(column: string[]): string {
  return column.join('\n');
}

/**
 * 验证翻译结果
 * @param translatedColumnData 翻译后的列数据
 * @param originalColumn 原始列数据
 * @returns 经过验证和调整的翻译列数据
 */
export function validateAndAdjustTranslatedColumn(
  translatedColumnData: string[],
  originalColumn: string[]
): string[] {
  // 验证翻译结果的长度
  if (translatedColumnData.length === originalColumn.length) {
    return translatedColumnData;
  }
  
  // 如果翻译结果行数超过原始数据，只取前面部分
  if (translatedColumnData.length > originalColumn.length) {
    return translatedColumnData.slice(0, originalColumn.length);
  }
  
  // 如果翻译结果行数不够，使用翻译结果并补充空字符串
  return [
    ...translatedColumnData,
    ...new Array(originalColumn.length - translatedColumnData.length).fill('')
  ];
}

/**
 * 检查列内容是否需要翻译
 * @param column 列数据
 * @returns 是否需要翻译
 */
export function shouldTranslateColumn(column: string[]): boolean {
  // 空列不需要翻译
  if (column.length === 0) {
    return false;
  }
  
  // 检查列是否只包含数字或空值
  const isNumericOnly = column.every(cell => {
    const trimmed = cell.trim();
    return trimmed === '' || !isNaN(Number(trimmed));
  });
  
  // 如果列只包含数字或空值，则不需要翻译
  if (isNumericOnly) {
    return false;
  }
  
  return true;
} 