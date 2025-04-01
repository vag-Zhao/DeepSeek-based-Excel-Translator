import * as fs from 'fs';
import * as path from 'path';

/**
 * 确保目录存在，如果不存在则创建
 * @param dirPath 目录路径
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 验证文件是否存在
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
export function isFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * 验证文件扩展名
 * @param filePath 文件路径
 * @param validExtensions 有效的扩展名数组
 * @returns 扩展名是否有效
 */
export function isValidFileExtension(
  filePath: string, 
  validExtensions: string[]
): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return validExtensions.includes(ext);
}

/**
 * 获取文件名（不含扩展名）
 * @param filePath 文件路径
 * @returns 文件名（不含扩展名）
 */
export function getFileNameWithoutExtension(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * 清理翻译数据中的注释内容
 * @param data 数据对象
 * @returns 清理后的数据对象
 */
export function cleanTranslationData<T>(data: T): T {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    // 过滤掉数组中的注释行（通常以"注："或"("开头的行）
    return data.filter((item: any) => {
      if (typeof item === 'string') {
        return !(
          item.trim().startsWith('（注：') || 
          item.trim().startsWith('(注：') ||
          item.trim().startsWith('（') ||
          item.trim().startsWith('(') ||
          item.includes('注：') ||
          item === ''
        );
      }
      return true;
    }) as unknown as T;
  } else if (typeof data === 'object') {
    const result = { ...data } as Record<string, any>;
    
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = cleanTranslationData(result[key]);
      }
    }
    
    return result as T;
  }
  
  return data;
} 