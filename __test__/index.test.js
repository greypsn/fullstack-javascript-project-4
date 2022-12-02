import { test, expect, beforeEach } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import fs from 'fs/promises';
import os from 'os';
import prettier from 'prettier';
import pageloader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let tempDir;
const url = 'https://ru.hexlet.io/courses';
// const dirName = 'ru-hexlet-io-courses_files';
const fixturesFiles = {
  html: 'load-full-before.html',
  css: 'style.css',
  js: 'script.js',
  png: 'nodejs.png',
};

beforeEach(async () => {
  nock(/ru\.hexlet\.io/)
    .get(/\/courses/)
    .replyWithFile(200, getFixturePath(fixturesFiles.html))
    .get(/\/assets\/professions\/nodejs\.png/)
    .replyWithFile(200, getFixturePath(fixturesFiles.png))
    .get(/\/packs\/js\/runtime\.js/)
    .replyWithFile(200, getFixturePath(fixturesFiles.js))
    .get(/\/assets\/application\.css/)
    .replyWithFile(200, getFixturePath(fixturesFiles.css))
    .get(/\/courses/)
    .replyWithFile(200, getFixturePath(fixturesFiles.html));

  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  await pageloader(url, tempDir);
});

test('load html', async () => {
  const htmlAfter = 'ru-hexlet-io-courses.html';
  const htmlAfterPath = path.join(tempDir, htmlAfter);
  const afterHTML = await fs.readFile(htmlAfterPath, 'utf-8');
  const beforeHTML = await fs.readFile(getFixturePath('load-full-after.html'), 'utf-8');
  const prettified = prettier.format(afterHTML, { parser: 'html' });
  expect(prettified.trim()).toBe(beforeHTML.trim());
});

// const testFiles = [
//   { key: 'html', file: 'ru-hexlet-io-courses.html' },
//   { key: 'css', file: 'ru-hexlet-io-assets-application.css' },
//   { key: 'js', file: 'ru-hexlet-io-packs-js-runtime.js' },
//   { key: 'png', file: 'ru-hexlet-io-assets-professions-nodejs.png' },
// ];

// test.each(testFiles)('$key file', async (el) => {
//   const afterFile = await fs.readFile(path.join(tempDir, dirName, el.file), 'utf-8');
//   const beforeFile = await fs.readFile(getFixturePath(fixturesFiles[el.key]), 'utf-8');
//   expect(afterFile.trim()).toBe(beforeFile.trim());
// });
