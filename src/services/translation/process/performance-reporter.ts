/**
 * 性能报告模块 - 处理翻译性能统计的生成和报告
 */
import { TranslationResult, PerformanceReport } from '../../../models/types';

/**
 * 列翻译任务信息接口
 */
export interface ColumnTranslationTask {
  colKey: string;
  columnHeader: string | undefined;
  promise: Promise<TranslationResult>;
  startTime: number;
  endTime?: number;
  /** 列内部的并发块数量 */
  chunkCount?: number;
}

/**
 * 格式化时间
 * @param milliseconds 毫秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const remainingMilliseconds = milliseconds % 1000;
  
  if (minutes > 0) {
    return `${minutes}分${remainingSeconds}.${remainingMilliseconds}秒`;
  } else {
    return `${seconds}.${remainingMilliseconds}秒`;
  }
}

/**
 * 计算并生成性能报告
 * @param tasks 列翻译任务列表
 * @param overallStartTime 总体开始时间
 * @param overallEndTime 总体结束时间
 * @returns 性能报告对象
 */
export function generatePerformanceReport(
  tasks: ColumnTranslationTask[],
  overallStartTime: number,
  overallEndTime: number
): PerformanceReport {
  const totalDuration = overallEndTime - overallStartTime;
  const completedTasks = tasks.filter(task => task.endTime);
  const totalColumns = tasks.length;
  
  // 计算任务持续时间
  const taskDurations = completedTasks.map(task => task.endTime! - task.startTime);
  const averageDuration = taskDurations.length > 0 
    ? taskDurations.reduce((sum, duration) => sum + duration, 0) / taskDurations.length 
    : 0;
  const maxDuration = taskDurations.length > 0 ? Math.max(...taskDurations) : 0;
  const minDuration = taskDurations.length > 0 ? Math.min(...taskDurations) : 0;
  const serialExecutionTime = taskDurations.reduce((sum, duration) => sum + duration, 0);
  const concurrencyGain = totalDuration > 0 ? serialExecutionTime / totalDuration : 1;
  
  // 统计总单元格数和总块数
  const totalCells = tasks.length;
  const totalChunks = tasks.reduce((sum, task) => sum + (task.chunkCount || 1), 0);
  
  // 计算平均每列的块数
  const avgChunksPerColumn = totalChunks / totalColumns;
  
  // 计算实际使用的并发级别（列级 * 平均每列块数）
  const effectiveConcurrencyLevel = Math.min(tasks.length, require('os').cpus().length - 1) * avgChunksPerColumn;
  
  return {
    totalColumns,
    totalCells,
    totalDuration,
    averageDuration,
    maxDuration,
    minDuration,
    serialExecutionTime,
    concurrencyGain,
    totalChunks,
    avgChunksPerColumn,
    effectiveConcurrencyLevel
  };
}

/**
 * 打印性能报告
 * @param report 性能报告对象
 */
export function printPerformanceReport(report: PerformanceReport): void {
  console.log(`\n===== 并发翻译性能统计 =====`);
  console.log(`总列数: ${report.totalColumns}`);
  console.log(`总单元格数: ${report.totalCells}`);
  console.log(`总翻译时间: ${formatTime(report.totalDuration)}`);
  console.log(`平均每列处理时间: ${formatTime(report.averageDuration)}`);
  console.log(`最长列处理时间: ${formatTime(report.maxDuration)}`);
  console.log(`最短列处理时间: ${formatTime(report.minDuration)}`);
  console.log(`理论串行执行时间: ${formatTime(report.serialExecutionTime)}`);
  console.log(`并发效率提升: ${report.concurrencyGain.toFixed(2)}倍`);
  
  // 显示多级并发统计
  if (report.totalChunks && report.avgChunksPerColumn && report.effectiveConcurrencyLevel) {
    console.log(`\n===== 多级并发统计 =====`);
    console.log(`总内容块数: ${report.totalChunks}`);
    console.log(`平均每列块数: ${report.avgChunksPerColumn.toFixed(2)}`);
    console.log(`有效并发级别: ${report.effectiveConcurrencyLevel.toFixed(2)}（列级*块级）`);
  }
  
  console.log(`=============================\n`);
} 