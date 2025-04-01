/**
 * 数据分析模块 - 分析Excel数据模式和特征
 */

/**
 * 分析数据行的模式特征
 * @param dataLines 数据行数组
 * @returns 数据模式特征描述
 */
export function analyzeDataPatterns(dataLines: string[]): string[] {
  const patterns: string[] = [];
  
  // 检查是否主要包含数字
  const numericCount = dataLines.filter(line => /^-?\d+(\.\d+)?$/.test(line.trim())).length;
  if (numericCount > dataLines.length * 0.7) {
    patterns.push('主要包含数值数据');
  }
  
  // 检查是否包含百分比
  const percentCount = dataLines.filter(line => /%/.test(line)).length;
  if (percentCount > dataLines.length * 0.3) {
    patterns.push('包含百分比值');
  }
  
  // 检查是否包含货币值
  const currencyCount = dataLines.filter(line => /\$|\€|\¥/.test(line)).length;
  if (currencyCount > dataLines.length * 0.3) {
    patterns.push('包含货币金额');
  }
  
  // 检查是否包含日期
  const dateCount = dataLines.filter(line => 
    /\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}/.test(line) || 
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(line)
  ).length;
  if (dateCount > dataLines.length * 0.3) {
    patterns.push('包含日期时间');
  }
  
  // 检查是否包含Y/N值
  const ynCount = dataLines.filter(line => /^[YN]$|^Yes$|^No$/i.test(line.trim())).length;
  if (ynCount > dataLines.length * 0.5) {
    patterns.push('包含是/否类型标记');
  }
  
  // 检查是否包含短代码
  const codeCount = dataLines.filter(line => /^[A-Z0-9]{1,5}$/.test(line.trim())).length;
  if (codeCount > dataLines.length * 0.5) {
    patterns.push('包含短代码标识');
  }
  
  // 检查是否包含缩写词
  const abbreviationCount = dataLines.filter(line => /^[A-Z]{2,}$/.test(line.trim())).length;
  if (abbreviationCount > dataLines.length * 0.3) {
    patterns.push('包含大量缩写词');
  }
  
  return patterns;
}

/**
 * 检测列中的特殊缩写词和代码
 * @param columnContent 列内容
 * @returns 检测到的缩写词数组
 */
export function detectAbbreviations(columnContent: string): string[] {
  // 检测大写字母缩写词
  const abbreviationMatches = columnContent.match(/\b[A-Z]{2,}\b/g) || [];
  
  // 检测特殊格式缩写词，如 N/A
  const specialAbbreviations = columnContent.match(/\b[A-Z][A-Z]?\/[A-Z][A-Z]?\b/g) || []; 
  
  // 检测字母数字混合代码，如 A123, 123B
  const numericCodes = columnContent.match(/\b[A-Z]\d+\b|\b\d+[A-Z]\b/g) || []; 
  
  // 检测单字母缩写，如 A, B, C (常见于分类或评级)
  const singleLetterCodes = columnContent.match(/\b[A-Z](?!\w)\b/g) || [];
  
  // 检测常见的特定领域缩写词模式
  // 房地产/城市规划相关
  const realEstateAbbr = columnContent.match(/\b(RH|RL|RM|C1|C2|C3|I1|I2|NA|FAR|GFA)\b/g) || [];
  
  // 科学/技术领域相关
  const techAbbr = columnContent.match(/\b(CPU|GPU|RAM|ROM|API|SDK|UI|UX|FPS|MB|GB|TB)\b/g) || [];
  
  // 金融领域相关
  const financeAbbr = columnContent.match(/\b(ROI|ROA|ROE|P\/E|EPS|EBITDA|IPO|M&A|YOY|QOQ)\b/g) || [];
  
  // 通用业务缩写
  const businessAbbr = columnContent.match(/\b(KPI|OKR|B2B|B2C|C2C|CEO|CTO|CFO|COO|HR)\b/g) || [];
  
  // 合并所有缩略词并去重
  const allAbbreviations = [
    ...abbreviationMatches, 
    ...specialAbbreviations, 
    ...numericCodes,
    ...singleLetterCodes,
    ...realEstateAbbr,
    ...techAbbr,
    ...financeAbbr,
    ...businessAbbr
  ];
  
  return [...new Set(allAbbreviations)];
}

/**
 * 提取唯一样本数据
 * @param dataLines 数据行数组
 * @param maxSamples 最大样本数量
 * @returns 唯一样本数据数组
 */
export function extractUniqueSamples(dataLines: string[], maxSamples: number = 5): string[] {
  // 过滤掉空值和只有空格的行
  const filteredLines = dataLines.filter(line => line && line.trim());
  // 选择一些有意义的样本（优先选择可能是缩写或专业术语的）
  const potentialTerms = filteredLines.filter(
    line => /[A-Z]{2,}/.test(line) || 
           /^[A-Z][a-z]+$/.test(line) || 
           /\d+[A-Za-z]+/.test(line)
  );
  
  // 如果有潜在的专业术语，优先使用它们
  const sampleSource = potentialTerms.length > 0 ? potentialTerms : filteredLines;
  
  // 获取不重复的样本
  return [...new Set(sampleSource.slice(0, Math.min(10, sampleSource.length)))].slice(0, maxSamples);
}

/**
 * 分析列标题的可能专业领域
 * @param columnHeader 列标题
 * @returns 可能的专业领域描述
 */
export function analyzePossibleDomain(columnHeader: string): string {
  if (/id|code|number|no\.|serial/i.test(columnHeader)) {
    return '标识符';
  } else if (/date|time|year|month|day|period/i.test(columnHeader)) {
    return '时间日期';
  } else if (/price|cost|value|amount|budget|fee|tax|revenue|expense/i.test(columnHeader)) {
    return '财务金额';
  } else if (/ratio|percent|rate|proportion|share/i.test(columnHeader)) {
    return '比率指标';
  } else if (/type|category|class|classification|group/i.test(columnHeader)) {
    return '分类标签';
  } else if (/status|state|condition|phase|stage/i.test(columnHeader)) {
    return '状态指标';
  } else if (/name|title|label/i.test(columnHeader)) {
    return '名称标识';
  } else if (/address|location|place|position|coordinate/i.test(columnHeader)) {
    return '位置信息';
  } else if (/description|detail|note|comment|remark/i.test(columnHeader)) {
    return '描述性内容';
  } else if (/zone|area|district|region/i.test(columnHeader)) {
    return '区域划分';
  } else if (/quality|grade|level|rank|rating/i.test(columnHeader)) {
    return '等级评定';
  } else if (/specification|spec|parameter|attribute/i.test(columnHeader)) {
    return '规格参数';
  } 
  return '';
}

/**
 * 提取列标题中的关键词
 * @param columnHeader 列标题
 * @returns 列标题关键词数组
 */
export function extractHeaderKeywords(columnHeader: string): string[] {
  // 先按照常见的分隔符分割
  const parts = columnHeader.split(/[\s_\-\.]+/);
  
  // 再处理驼峰命名法
  const keywords = [];
  for (const part of parts) {
    // 检测驼峰命名法并分割
    const camelCaseParts = part.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    keywords.push(...camelCaseParts);
  }
  
  // 过滤掉太短的词和常见的非关键词
  const filteredKeywords = keywords
    .filter(word => word.length > 1)
    .filter(word => !['the', 'and', 'or', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'to'].includes(word.toLowerCase()));
  
  return filteredKeywords.map(word => word.trim());
} 