import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 加载环境变量，支持打包后的可执行文件
 * 
 * 优先级：
 * 1. 外部.env文件（应用程序所在目录）
 * 2. 环境变量
 * 3. 内置默认值
 */
export function loadEnvironmentVariables(): void {
  try {
    // 获取应用程序路径
    const appDir = getAppDirectory();
    
    // 在应用程序目录中查找.env文件
    const externalEnvPath = path.join(appDir, '.env');
    
    // 检查外部.env文件是否存在
    if (fs.existsSync(externalEnvPath)) {
      console.log(`找到外部配置文件: ${externalEnvPath}`);
      // 加载外部.env文件
      dotenv.config({ path: externalEnvPath });
    } else {
      // 使用默认.env文件（如果存在）
      dotenv.config();
      
      // 检查是否缺少关键配置
      const apiKey = process.env.DEEPSEEK_API_KEY;
      const baseUrl = process.env.DEEPSEEK_API_BASE_URL;
      
      if (!apiKey || !baseUrl) {
        console.warn('警告: 未找到外部.env配置文件，且关键API配置不完整');
        console.warn(`请在应用程序目录创建.env文件: ${externalEnvPath}`);
        console.warn('或者设置环境变量: DEEPSEEK_API_KEY, DEEPSEEK_API_BASE_URL');
        
        // 创建示例.env文件
        createExampleEnvFile(externalEnvPath);
      }
    }
  } catch (error) {
    console.error('加载环境变量失败:', error);
    // 使用默认配置继续
    dotenv.config();
  }
}

/**
 * 获取应用程序目录
 * 支持开发环境和打包后的环境
 */
function getAppDirectory(): string {
  // 对于打包后的应用程序，__dirname 可能指向 snapshot 文件系统
  // process.execPath 包含可执行文件的路径
  const isPackaged = !process.argv[0].endsWith('node') && !process.argv[0].endsWith('node.exe');
  
  if (isPackaged) {
    // 打包后的环境，使用可执行文件目录
    return path.dirname(process.execPath);
  } else {
    // 开发环境，使用项目根目录
    return process.cwd();
  }
}

/**
 * 创建示例.env文件
 * @param filePath .env文件路径
 */
function createExampleEnvFile(filePath: string): void {
  try {
    const exampleContent = `# DeepSeek API配置
# 请替换为您的API密钥和基础URL
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_BASE_URL=https://api.deepseek.com

# 性能调优 (可选)
# MAX_CONCURRENT_WORKERS=4
# CHUNK_SIZE=10000
`;

    fs.writeFileSync(filePath, exampleContent, 'utf8');
    console.log(`已创建示例配置文件: ${filePath}`);
    console.log('请编辑该文件，填入您的API密钥后再次运行程序');
  } catch (error) {
    console.error(`无法创建示例配置文件: ${error}`);
  }
} 