#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { findComponentReferences } from './lib/analyzer.js';
import { formatOutput } from './lib/formatter.js';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

program
  .version('1.0.0')
  .argument('<component>', '要查找的组件名称')
  .option('-d, --dir <path>', '项目目录路径', process.cwd())
  .action((component, options) => {
    const results = findComponentReferences(options.dir, component);
    console.log(formatOutput(results, options.format));
    console.log(chalk.blue('✅ 完成\n'));

  });

program.parse(process.argv);
