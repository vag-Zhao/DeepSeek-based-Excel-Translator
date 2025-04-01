import { Services } from '../../index';
import { ExcelData, TranslationRequest, TranslationResult } from '../../../models/types';
import { buildDomainGlossary, buildColumnContext } from '../context';
import { WorkerManager } from '../../../utils/worker/worker-manager';
import { 
  formatTime, 
  ColumnTranslationTask, 
  generatePerformanceReport, 
  printPerformanceReport 
} from './performance-reporter';
import { 
  processColumnTranslationResult, 
  prepareColumnContent, 
  shouldTranslateColumn 
} from './column-processor';

/**
 * 翻译Excel列数据
 * @param excelData Excel数据
 * @param topic 主题
 * @returns 更新后的Excel数据（包含翻译后的列）
 */
export async function translateColumns(excelData: ExcelData, topic: string): Promise<ExcelData> {
  const translatedData: ExcelData = {
    headers: excelData.headers,
    columns: excelData.columns,
    translatedColumns: {}
  };
  
  // 如果没有列数据，直接返回
  if (!excelData.columns || Object.keys(excelData.columns).length === 0) {
    return translatedData;
  }
  
  // 创建专业领域词汇表
  const domainGlossary = buildDomainGlossary(excelData, topic);
  
  // 创建工作线程管理器
  const workerManager = new WorkerManager();
  
  // 存储所有的翻译任务
  const translationTasks: ColumnTranslationTask[] = [];
  
  const totalColumnCount = Object.keys(excelData.columns).length;
  console.log(`开始并行翻译 ${totalColumnCount} 列数据，使用最大 ${Math.min(totalColumnCount, require('os').cpus().length - 1)} 个工作线程...`);
  
  const overallStartTime = Date.now();
  
  // 为每一列创建翻译任务
  for (const [colKey, column] of Object.entries(excelData.columns)) {
    const columnHeader = excelData.headers[colKey];
    console.log(`准备翻译列: ${columnHeader || colKey} (${column.length} 行数据)`);
    
    // 检查列是否需要翻译
    if (!shouldTranslateColumn(column)) {
      console.log(`列 "${columnHeader || colKey}" 只包含数字或空值，跳过翻译`);
      translatedData.translatedColumns![colKey] = [...column];
      continue;
    }
    
    // 将列数据合并成一个字符串进行翻译
    const columnContent = prepareColumnContent(column);
    
    // 构建列特定的上下文
    const columnContext = buildColumnContext(
      columnHeader, 
      columnContent, 
      topic, 
      domainGlossary
    );
    
    // 创建翻译请求
    const translationRequest: TranslationRequest = {
      content: columnContent,
      context: columnContext
    };
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 提交翻译任务到工作线程
    const translationPromise = workerManager.submitTask(colKey, translationRequest)
      .then(result => {
        // 记录完成时间
        const endTime = Date.now();
        const task = translationTasks.find(t => t.colKey === colKey);
        if (task) {
          task.endTime = endTime;
          task.chunkCount = (result as any).chunkCount || 1; // 记录块数信息
          
          const duration = endTime - task.startTime;
          const chunkInfo = (result as any).chunkCount > 1 ? 
            `，使用了 ${(result as any).chunkCount} 个并发块` : '';
          console.log(`列 "${columnHeader || colKey}" 翻译完成，耗时: ${formatTime(duration)}${chunkInfo}`);
        }
        return result;
      });
    
    // 存储任务信息
    translationTasks.push({
      colKey,
      columnHeader,
      promise: translationPromise,
      startTime
    });
  }
  
  // 使用Promise.allSettled等待所有任务完成
  const results = await Promise.allSettled(translationTasks.map(task => (task as any).promise));
  
  // 处理翻译结果
  for (let i = 0; i < translationTasks.length; i++) {
    const { colKey, columnHeader } = translationTasks[i];
    const result = results[i];
    const column = excelData.columns[colKey];
    
    if (result.status === 'fulfilled') {
      processColumnTranslationResult(translatedData, colKey, columnHeader, column, result.value);
    } else {
      console.error(`翻译列 ${columnHeader || colKey} 失败: ${result.reason}`);
      translatedData.translatedColumns![colKey] = [...column];
    }
  }
  
  // 等待所有工作线程完成
  await workerManager.waitForAllTasks();
  
  const overallEndTime = Date.now();
  
  // 生成性能报告
  const report = generatePerformanceReport(translationTasks, overallStartTime, overallEndTime);
  
  // 打印性能报告
  printPerformanceReport(report);
  
  console.log(`所有列翻译完成`);
  return translatedData;
} 