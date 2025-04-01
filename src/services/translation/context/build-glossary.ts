import { ExcelData } from '../../../models/types';
import { 
  analyzeDataPatterns, 
  detectAbbreviations, 
  extractUniqueSamples, 
  analyzePossibleDomain, 
  extractHeaderKeywords 
} from './data-analyzer';

/**
 * 构建专业词汇表
 * @param excelData Excel数据
 * @param topic 主题
 * @returns 专业词汇表
 */
export function buildDomainGlossary(excelData: ExcelData, topic: string): string {
  let domainGlossary = `${topic}领域常见术语对照表：\n`;
  
  if (excelData.columns) {
    // 收集所有出现的缩写词和专业术语
    const uniqueTerms = new Set<string>();
    
    for (const [colKey, column] of Object.entries(excelData.columns)) {
      // 获取列标题
      const columnHeader = excelData.headers[colKey] || colKey;
      // 将列内容合并为字符串
      const columnContent = column.join('\n');
      // 检测列中的缩写词
      const abbreviations = detectAbbreviations(columnContent);
      
      // 将缩写词与列标题关联
      for (const abbr of abbreviations) {
        uniqueTerms.add(`${abbr} (${columnHeader})`);
      }
    }
    
    domainGlossary += Array.from(uniqueTerms).join(', ');
  }
  
  return domainGlossary;
}

/**
 * 为特定列构建翻译上下文
 * @param columnHeader 列标题
 * @param columnContent 列内容
 * @param topic 主题
 * @param domainGlossary 专业词汇表
 * @returns 列翻译上下文
 */
export function buildColumnContext(
  columnHeader: string,
  columnContent: string,
  topic: string,
  domainGlossary: string
): string {
  // 提取列标题中的关键词
  const headerKeywords = extractHeaderKeywords(columnHeader);
  
  // 分析列标题的可能专业领域
  const possibleDomain = analyzePossibleDomain(columnHeader);
  
  // 构建强调列标题专业性的上下文描述
  let columnContext = `${topic}领域中的"${columnHeader}"专业术语和数据`;
  
  if (possibleDomain) {
    columnContext += `。此列属于${possibleDomain}类型数据`;
  }
  
  columnContext += `。\n\n专业关键点：列标题"${columnHeader}"是理解和翻译该列所有内容的决定性上下文，所有缩写词和专业术语必须严格基于此列标题在${topic}领域中的专业含义进行理解。`;
  
  if (headerKeywords.length > 0) {
    columnContext += `\n\n列标题中的关键专业术语：${headerKeywords.join('、')}`;
  }
  
  // 检测列数据的特征模式
  const dataLines = columnContent.split('\n').filter(Boolean);
  const patterns = analyzeDataPatterns(dataLines);
  
  if (patterns.length > 0) {
    columnContext += `\n\n列数据模式特征：${patterns.join('、')}`;
  }
  
  // 检测列中是否包含特殊缩写词或代码
  const uniqueAbbreviations = detectAbbreviations(columnContent);
  
  if (uniqueAbbreviations.length > 0) {
    // 对缩写词进行分类
    const commonAbbr = uniqueAbbreviations.filter(abbr => 
      ['NA', 'N/A', 'TBD', 'TBA', 'N/C', 'N/D'].includes(abbr)
    );
    
    const specialAbbr = uniqueAbbreviations.filter(abbr => 
      !commonAbbr.includes(abbr)
    );
    
    // 优先处理特殊的专业缩写词
    if (specialAbbr.length > 0) {
      const abbreviationExamples = specialAbbr.slice(0, 7).join('、');
      columnContext += `\n\n该列专业术语缩写包括: ${abbreviationExamples}等。这些缩写词必须严格解析为列标题"${columnHeader}"在${topic}领域中定义的专业术语，不得简单翻译为通用含义。`;
    }
    
    // 处理通用缩写词
    if (commonAbbr.length > 0) {
      columnContext += `\n\n该列还包含通用缩写: ${commonAbbr.join('、')}。请根据列标题"${columnHeader}"的上下文确定其在${topic}领域中的准确专业含义。`;
    }
    
    // 添加特别的缩写词处理提示
    if (uniqueAbbreviations.some(abbr => ['RH', 'RL', 'RM', 'C1', 'C2', 'I1', 'I2'].includes(abbr))) {
      columnContext += `\n\n特别注意：缩写词${uniqueAbbreviations.join('、')}需要严格按照列属性来翻译，严禁使用通用解释，在不同列中可能表示不同的专业含义，请根据列标题"${columnHeader}"的上下文确定其在${topic}领域中的准确专业含义，需要严格匹配列属性的专业含义`;
    }
  }
  
  // 提取列中的样本数据作为参考
  const uniqueSamples = extractUniqueSamples(dataLines);
  if (uniqueSamples.length > 0) {
    columnContext += `\n\n列数据样本: ${uniqueSamples.join('、')}`;
  }
  
  // 加入词汇表信息
  columnContext += `\n\n${domainGlossary}`;
  
  return columnContext;
} 