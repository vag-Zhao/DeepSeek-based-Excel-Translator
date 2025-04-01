import * as path from 'path';
import * as fs from 'fs';
import { TranslationService } from './services/translation';
import { isFileExists, isValidFileExtension } from './utils/file-utils';
import { loadEnvironmentVariables } from './utils/env-loader';

// 版本信息
const VERSION = '1.0.0';

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
Excel翻译工具 v${VERSION} - 基于DeepSeek API

用法: excel翻译工具 <Excel或CSV文件路径> [选项]

选项:
  --help, -h          显示帮助信息
  --version, -v       显示版本信息

例子:
  excel翻译工具 ./data.xlsx       翻译Excel文件
  excel翻译工具 ./data.csv        翻译CSV文件

配置:
  程序会在同目录下查找.env文件，用于配置DeepSeek API
  如果找不到，会自动创建示例配置文件
  `);
}

/**
 * 显示版本信息
 */
function showVersion(): void {
  console.log(`Excel翻译工具 v${VERSION}`);
}

/**
 * 主程序入口
 */
async function main(): Promise<void> {
  console.log('=== 文件翻译服务 基于DeepSeek API ===');
  
  // 加载环境变量
  loadEnvironmentVariables();
  
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  // 处理特殊命令
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    showVersion();
    return;
  }
  
  if (args.length === 0) {
    console.error('错误: 请提供Excel或CSV文件路径作为参数');
    console.log('用法: excel翻译工具 <Excel或CSV文件路径>');
    console.log('使用 --help 查看更多信息');
    return;
  }
  
  const filePath = path.resolve(args[0]);
  
  // 验证文件
  if (!isFileExists(filePath)) {
    console.error(`错误: 文件不存在 - ${filePath}`);
    return;
  }
  
  // 支持的文件扩展名
  const supportedExtensions = ['.xlsx', '.xls', '.csv'];
  if (!isValidFileExtension(filePath, supportedExtensions)) {
    console.error(`错误: 文件必须是Excel文件(.xlsx或.xls)或CSV文件(.csv)`);
    return;
  }
  
  // 检查API配置
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_API_BASE_URL;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('错误: DeepSeek API密钥未配置或无效');
    console.error('请在.env文件中设置有效的DEEPSEEK_API_KEY');
    return;
  }
  
  if (!baseUrl) {
    console.error('错误: DeepSeek API基础URL未配置');
    console.error('请在.env文件中设置DEEPSEEK_API_BASE_URL');
    return;
  }
  
  // 创建翻译服务并处理
  const translationService = new TranslationService();
  
  try {
    console.log(`正在处理文件: ${filePath}`);
    const result = await translationService.processExcelTranslation(filePath);
    
    if (result) {
      console.log('文件翻译处理完成!');
    } else {
      console.error('文件翻译处理失败!');
    }
  } catch (error) {
    console.error('处理过程中发生错误:', error);
  } finally {
    translationService.close();
  }
}

// 执行主函数
main().catch(error => {
  console.error('程序执行错误:', error);
  process.exit(1);
}); 