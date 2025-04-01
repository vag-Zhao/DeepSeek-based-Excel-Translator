import * as readline from 'readline';

// 创建全局Readline接口实例
let rl: readline.Interface | null = null;

/**
 * 获取Readline接口实例
 * @returns Readline接口实例
 */
function getReadline(): readline.Interface {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  return rl;
}

/**
 * 请求用户输入
 * @param question 问题文本
 * @param defaultAnswer 默认回答
 * @returns 用户输入的文本
 */
export function askQuestion(question: string, defaultAnswer: string = ''): Promise<string> {
  return new Promise((resolve) => {
    const readline = getReadline();
    readline.question(question, (answer) => {
      resolve(answer || defaultAnswer);
    });
  });
}

/**
 * 关闭Readline接口
 */
export function closeReadline(): void {
  if (rl) {
    rl.close();
    rl = null;
  }
} 