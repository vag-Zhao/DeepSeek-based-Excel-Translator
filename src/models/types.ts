/**
 * Excel表格数据类型定义
 */
export interface ExcelData {
  /**
   * 表头数据，包含列名及其内容
   */
  headers: Record<string, string>;
  
  /**
   * 列数据，包含每列的所有内容
   */
  columns?: Record<string, string[]>;
  
  /**
   * 翻译后的列数据
   */
  translatedColumns?: Record<string, string[]>;
}

/**
 * 翻译请求参数
 */
export interface TranslationRequest {
  /**
   * 需要翻译的内容
   */
  content: string | Record<string, string>;
  
  /**
   * 翻译主题/上下文
   */
  context?: string;
  
  /**
   * 源语言
   */
  sourceLanguage?: string;
  
  /**
   * 目标语言
   */
  targetLanguage?: string;
  
  /**
   * 主题
   */
  topic?: string;
  
  /**
   * 表头
   */
  headers?: Record<string, string>;
}

/**
 * 翻译结果
 */
export interface TranslationResult {
  /**
   * 翻译后的内容
   */
  translatedContent: string | Record<string, string>;
  
  /**
   * 是否成功
   */
  success: boolean;
  
  /**
   * 错误信息（如有）
   */
  error?: string;
  
  /**
   * 错误消息（兼容性字段）
   */
  message?: string;
  
  /**
   * 使用的内容块数量
   */
  chunkCount?: number;
}

/**
 * 主题分析结果
 */
export interface TopicAnalysisResult {
  /**
   * 分析得出的主题
   */
  topic: string;
  
  /**
   * 是否成功
   */
  success: boolean;
  
  /**
   * 错误信息（如有）
   */
  error?: string;
}

/**
 * Excel处理结果
 */
export interface ExcelProcessResult {
  /**
   * 是否成功
   */
  success: boolean;
  
  /**
   * 输出文件路径
   */
  outputFilePath?: string;
  
  /**
   * 错误信息（如有）
   */
  error?: string;
  
  /**
   * 消息
   */
  message?: string;
}

/**
 * 性能报告接口
 */
export interface PerformanceReport {
  /** 总列数 */
  totalColumns: number;
  /** 总单元格数 */
  totalCells: number;
  /** 总处理时间（毫秒） */
  totalDuration: number;
  /** 平均处理时间（毫秒） */
  averageDuration: number;
  /** 最长处理时间（毫秒） */
  maxDuration: number;
  /** 最短处理时间（毫秒） */
  minDuration: number;
  /** 理论串行执行时间（毫秒） */
  serialExecutionTime: number;
  /** 并发效率提升（倍数） */
  concurrencyGain: number;
  /** 总内容块数 */
  totalChunks?: number;
  /** 平均每列块数 */
  avgChunksPerColumn?: number;
  /** 有效并发级别 */
  effectiveConcurrencyLevel?: number;
} 