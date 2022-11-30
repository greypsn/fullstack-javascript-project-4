import { test, expect } from '@jest/globals';
import { urlFile, urlDirectory } from '../src/utils.js';

test('urlFile', () => {
  const nameFile = 'page-loader-hexlet-repl-co.html';
  const nameFileActual = urlFile('https://page-loader.hexlet.repl.co');
  expect(nameFileActual).toBe(nameFile);
});

test('urlDirectory', () => {
  const nameFile = 'page-loader-hexlet-repl-co_files';
  const nameFileActual = urlDirectory('https://page-loader.hexlet.repl.co');
  expect(nameFileActual).toBe(nameFile);
});
