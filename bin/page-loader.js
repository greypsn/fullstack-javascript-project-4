#!/usr/bin/env node

import { Command } from 'commander';
import pageloader from '../src/index.js';
import { pathDownloaded } from '../src/utils.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .helpOption('-h, --help', 'display help for command')
  .argument('<url>')
  .action((url) => {
    pageloader(url, program.opts().output)
      .then(() => {
        console.log(`Page was successfully downloaded into ${pathDownloaded(url, program.opts().output)}`);
      });
  });

program.parse();
