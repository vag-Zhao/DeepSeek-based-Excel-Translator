import { Services } from '../../index';
import { ExcelData } from '../../../models/types';

/**
 * 翻译Excel表头
 * @param excelData Excel数据
 * @param topic 主题
 * @returns 更新后的Excel数据（包含翻译后的表头）
 */
export async function translateHeaders(excelData: ExcelData, topic: string): Promise<ExcelData> {
  const services = Services.getInstance();
  const translatedData: ExcelData = {
    headers: excelData.headers,
    columns: excelData.columns,
    translatedColumns: {}
  };
  
  // 创建一个副本用于翻译列标题
  const headerKeysArray = Object.keys(excelData.headers);
  const headerValuesArray = Object.values(excelData.headers);
  
  // 翻译列标题
  console.log('翻译列标题...');
  const headerContent = headerValuesArray.join('\n');
  
  // 为表头翻译提供更具体的专业背景
  const headerTranslationContext = `这是${topic}领域的专业表格的列标题，包含各种行业术语和缩写。要求每一个表头都必须完整翻译成中文，不能漏掉任何一个。`;
  
  const headerTranslationResult = await services.deepSeekService.translateContent({
    content: headerContent,
    context: headerTranslationContext
  });
  
  if (headerTranslationResult.success) {
    if (typeof headerTranslationResult.translatedContent === 'string') {
      const translatedHeaders = headerTranslationResult.translatedContent.split('\n');
      
      // 确保标题翻译结果与原始标题长度一致
      if (translatedHeaders.length === headerValuesArray.length) {
        const translatedHeadersObj: Record<string, string> = {};
        headerKeysArray.forEach((key, index) => {
          translatedHeadersObj[key] = translatedHeaders[index];
        });
        translatedData.headers = translatedHeadersObj;
      } else {
        console.warn('标题翻译结果行数不匹配，保留原始标题');
      }
    } else {
      console.warn('标题翻译结果格式不正确，保留原始标题');
    }
  } else {
    console.warn('标题翻译失败，保留原始标题');
  }
  
  return translatedData;
} 