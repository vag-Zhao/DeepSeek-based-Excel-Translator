/**
 * DeepSeek 提示构建模块
 */

/**
 * 系统提示词，定义翻译助手的角色和行为
 */
export const SYSTEM_PROMPT = '你是一位精通各专业领域术语的专业翻译专家。你能够识别并正确翻译不同专业领域的术语、缩写和代码。' +
  '你深刻理解列标题(属性单元格)是决定该列数据专业含义的关键，并严格根据列标题和领域知识翻译每个术语。' +
  '你认识到相同的缩写在不同列中可能有完全不同的专业含义，因此总是基于列标题的专业语境来翻译。' +
  '你只提供专业、准确的翻译结果，不添加任何解释或注释。';

/**
 * 构建通用专业领域的翻译提示词
 * @param content 要翻译的内容
 * @param context 上下文
 * @returns 构建的提示词
 */
export function buildTranslationPrompt(content: string, context?: string): string {
  const basePrompt = `请将以下内容专业翻译成中文，这是关于"${context || '专业领域'}"的专业数据。你需要根据列标题和专业领域术语进行精确翻译，特别注意：

1. 列标题（属性单元格）是该列所有数据的专业定义核心，必须严格基于列标题来理解和翻译该列中的所有内容
2. 该列中的专业术语、缩写词、代码必须严格按照列标题在该专业领域中的定义和用法来翻译
3. 相同的缩写在不同的列中代表完全不同的专业术语，必须依据当前列标题来确定其精确专业含义
4. 严格保持数据的专业性，避免使用通用解释替代专业术语，尤其对NA、N/A等缩写要基于列标题确定其专业含义
5. 直接给出翻译结果，不要加任何注释、解释或额外说明
6. 保持原始数据的行数和格式
7. 对于数据中的标准代码、型号、编号类内容，如能确定其专业含义则翻译，否则保留原有形式
8. 同一列中的相同内容必须使用相同的翻译，保持一致性
9. 对于缩写词，务必翻译成完整的专业术语，而非保留缩写或使用通用解释
10. 对于数据中的日期、时间、金额等格式，保持原有格式
11. 对于数据中的百分比、小数等格式，保持原有格式
12. 对于数据中的特殊符号，保持原有格式
13，对于表格中所出现的缩写词都需要严格按照列属性来翻译，严禁使用通用解释
14，对于表格中所出现的专业术语，需要严格按照列属性来翻译，严禁使用通用解释

该列的专业上下文描述：${context || '未提供上下文'}

内容如下：\n\n${content}`;

  return basePrompt;
}

/**
 * 提取上下文中的列标题
 * @param context 上下文描述
 * @param defaultHeader 默认列标题
 * @returns 提取的列标题
 */
export function extractColumnHeaderFromContext(context: string | undefined, defaultHeader: string = '未知列'): string {
  if (!context) {
    return defaultHeader;
  }
  
  // 尝试从上下文中提取列标题
  const headerMatch = context.match(/领域中的"([^"]+)"专业术语/);
  if (headerMatch && headerMatch[1]) {
    return headerMatch[1];
  }
  
  return defaultHeader;
} 