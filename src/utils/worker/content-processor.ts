/**
 * 工作线程内容处理模块
 * 用于处理翻译内容的分割、合并和验证
 */

/**
 * 将内容字符串分割为行数组
 * @param content 内容字符串
 * @returns 行数组
 */
export function splitContentIntoLines(content: string): string[] {
  return content.split('\n');
}

/**
 * 将行数组合并为内容字符串
 * @param lines 行数组
 * @returns 合并后的内容字符串
 */
export function joinLinesToContent(lines: string[]): string {
  return lines.join('\n');
}

/**
 * 验证翻译结果行数与原始内容行数是否匹配
 * @param translatedLines 翻译后的行数组
 * @param originalLines 原始内容行数组
 * @throws 如果行数不匹配，则抛出错误
 */
export function validateLineCount(translatedLines: string[], originalLines: string[]): void {
  if (translatedLines.length !== originalLines.length) {
    throw new Error(`翻译结果行数(${translatedLines.length})与原内容行数(${originalLines.length})不匹配`);
  }
}

/**
 * 唯一内容映射结构
 */
export interface UniqueContentMapping {
  /** 唯一内容列表 */
  uniqueContents: string[];
  /** 唯一内容索引映射，键为内容，值为所有出现位置的索引数组 */
  uniqueIndexMap: Map<string, number[]>;
}

/**
 * 内容块接口，用于并行处理
 */
export interface ContentChunk {
  /** 块ID */
  id: number;
  /** 块内容 */
  content: string;
  /** 起始行索引 */
  startLineIndex: number;
  /** 结束行索引 */
  endLineIndex: number;
  /** 行数量 */
  lineCount: number;
}

/**
 * 收集需要翻译的唯一内容
 * @param contentLines 内容行数组
 * @returns 包含唯一内容和索引映射的对象
 */
export function collectUniqueContents(contentLines: string[]): UniqueContentMapping {
  const uniqueContents: string[] = [];
  const uniqueIndexMap: Map<string, number[]> = new Map();
  
  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i].trim();
    if (!line) continue;
    
    if (!uniqueIndexMap.has(line)) {
      uniqueContents.push(line);
      uniqueIndexMap.set(line, [i]);
    } else {
      uniqueIndexMap.get(line)!.push(i);
    }
  }
  
  return { uniqueContents, uniqueIndexMap };
}

/**
 * 应用翻译结果到所有位置
 * @param translatedLines 翻译结果行数组
 * @param uniqueContents 唯一内容列表
 * @param uniqueIndexMap 唯一内容索引映射
 * @param translatedUniqueLines 翻译后的唯一内容行数组
 */
export function applyTranslationsToAllPositions(
  translatedLines: string[],
  uniqueContents: string[],
  uniqueIndexMap: Map<string, number[]>,
  translatedUniqueLines: string[]
): void {
  for (let i = 0; i < uniqueContents.length; i++) {
    const originalContent = uniqueContents[i];
    const translatedContent = translatedUniqueLines[i];
    
    // 应用翻译结果到所有相同内容的位置
    const positions = uniqueIndexMap.get(originalContent) || [];
    for (const position of positions) {
      translatedLines[position] = translatedContent;
    }
  }
}

/**
 * 处理对象类型的内容
 * @param content 内容（可能是字符串或对象）
 * @returns 处理后的字符串内容
 */
export function processContent(content: string | Record<string, any>): string {
  return typeof content === 'string' ? content : JSON.stringify(content);
}

/**
 * 将内容分割成多个块进行并行处理
 * @param contentLines 内容行数组
 * @param chunkCount 块数量（建议根据CPU核心数决定）
 * @returns 内容块数组
 */
export function splitContentIntoChunks(contentLines: string[], chunkCount: number): ContentChunk[] {
  // 确保至少有1个块
  chunkCount = Math.max(1, chunkCount);
  
  // 如果行数少于块数，每行一个块
  if (contentLines.length <= chunkCount) {
    return contentLines.map((line, index) => ({
      id: index,
      content: line,
      startLineIndex: index,
      endLineIndex: index,
      lineCount: 1
    }));
  }
  
  // 计算每个块的大致行数
  const linesPerChunk = Math.ceil(contentLines.length / chunkCount);
  const chunks: ContentChunk[] = [];
  
  for (let i = 0; i < chunkCount; i++) {
    const startIdx = i * linesPerChunk;
    const endIdx = Math.min(startIdx + linesPerChunk - 1, contentLines.length - 1);
    
    // 如果已经没有行可分配了，结束循环
    if (startIdx > endIdx) break;
    
    const chunkLines = contentLines.slice(startIdx, endIdx + 1);
    chunks.push({
      id: i,
      content: joinLinesToContent(chunkLines),
      startLineIndex: startIdx,
      endLineIndex: endIdx,
      lineCount: chunkLines.length
    });
  }
  
  return chunks;
}

/**
 * 合并多个块的翻译结果
 * @param chunks 已翻译的内容块
 * @param totalLineCount 总行数
 * @returns 合并后的行数组
 */
export function mergeChunkResults(chunks: ContentChunk[], totalLineCount: number): string[] {
  // 创建结果数组
  const mergedLines = new Array<string>(totalLineCount);
  
  // 按照每个块的起始位置填充结果数组
  for (const chunk of chunks) {
    const chunkLines = splitContentIntoLines(chunk.content);
    
    for (let i = 0; i < chunkLines.length; i++) {
      const position = chunk.startLineIndex + i;
      if (position < totalLineCount) {
        mergedLines[position] = chunkLines[i];
      }
    }
  }
  
  return mergedLines;
} 