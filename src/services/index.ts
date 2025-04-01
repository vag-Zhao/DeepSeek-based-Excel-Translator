/**
 * 服务模块导出文件
 * 导出应用程序使用的所有服务
 */
import { DeepSeekService } from './deepseek';
import { ExcelService } from './excel';
import { ServicesType, ServiceInstances } from './services.d';

// 导出翻译服务
export * from './translation/process';
export * from './translation/context';

// 导出 DeepSeek 服务
export { DeepSeekService, ExcelService };

// 创建服务实例
const deepseekInstance = new DeepSeekService();
const excelInstance = new ExcelService();

/**
 * 服务聚合对象
 */
export const Services: ServicesType = {
  deepseek: deepseekInstance,
  getInstance: (): ServiceInstances => ({
    deepSeekService: deepseekInstance,
    excelService: excelInstance
  })
}; 