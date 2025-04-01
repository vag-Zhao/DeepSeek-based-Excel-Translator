import * as readline from 'readline';

// 创建全局readline接口实例
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 获取用户输入
 * @param prompt 提示文本
 * @returns 用户输入
 */
export function getUserInput(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer.trim());
    });
  });
}

/**
 * 获取用户确认
 * @param prompt 提示文本
 * @param defaultValue 默认值
 * @returns 用户确认的值
 */
export function getUserConfirmation(prompt: string, defaultValue: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * 关闭readline接口
 */
export function closeReadline(): void {
  rl.close();
} 