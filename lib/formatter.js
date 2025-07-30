import path from 'path';
import chalk from 'chalk'

export function formatOutput(results, format = 'text') {
  if (format === 'json') {
    return JSON.stringify(results, null, 2);
  }

  let output = '';
  results.forEach(item => {
    output += `${chalk.green(`${path.relative(process.cwd(), item.file)}:${item.line}`)} \n`;
    output += `${chalk.yellow(`类型: ${item.type}`)}`;
    if (item.localName) output;
    output += '\n\n';
  });
  
  return output || `${chalk.red(`没有找到引用此文件！`)}`;
}
