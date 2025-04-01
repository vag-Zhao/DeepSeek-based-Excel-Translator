/**
 * 翻译处理模块导出文件
 */

// 主要功能导出
export { translateColumns } from './translate-columns';
export { formatTime, generatePerformanceReport, printPerformanceReport, ColumnTranslationTask } from './performance-reporter';
export { 
  processColumnTranslationResult, prepareColumnContent, 
  validateAndAdjustTranslatedColumn, shouldTranslateColumn 
} from './column-processor';

// 类型重新导出
export type { PerformanceReport } from '../../../models/types'; 