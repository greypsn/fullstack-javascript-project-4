import { test, expect } from '@jest/globals';
import { createNameFile } from '../src/utils.js';

test('createNameFile', () => {
  const nameFile = 'page-loader-hexlet-repl-co.html';
  const nameFileActual = createNameFile('https://page-loader.hexlet.repl.co');
  expect(nameFileActual).toBe(nameFile);
});
