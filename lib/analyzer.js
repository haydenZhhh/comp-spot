import { parse } from '@babel/parser';
import fs from 'fs';
import path from 'path';
import _traverse from '@babel/traverse';
import chalk from 'chalk';
const { default: traverse } = _traverse;

export function findComponentReferences(dir, componentName) {
    // 存储结果
    const results = [];
  
  function processFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    try {
        // 生成AST
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
       // 遍历AST
      traverse(ast, {
        // 处理import语句
        ImportDeclaration({node}) {
          const importedName = node.specifiers.find(s => 
            s.imported?.name === componentName || 
            s.local?.name === componentName
          );
          if (importedName) {
            results.push({
              file: filePath,
              type: 'import导入',
              line: node.loc.start.line,
              localName: importedName.local.name
            });
          }
        },
        // 处理组件使用
        JSXElement({node}) {
          if (node.openingElement.name.name === componentName) {
            results.push({
              file: filePath,
              type: '组件使用',
              line: node.loc.start.line
            });
          }
        },
        // 处理函数调用
        CallExpression({node}) {
          if (node.callee.name === componentName) {
            results.push({
              file: filePath,
              type: '函数调用',
              line: node.loc.start.line
            });
          }
        }
      });
    } catch (e) {
      console.error(` ${chalk.red(`错误 ${filePath}:${ e.message}`)} `);
    }
  }

  // 递归遍历目录
  function walkDir(dir) {
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      // 处理子目录
      if (stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.startsWith('.')) {
          walkDir(fullPath);
        }
      } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        // 处理源码文件
        processFile(fullPath);
      }
    }
  }

  console.log(chalk.blue('⏳ 查找中...\n'));
  walkDir(dir);
  return results;
}
