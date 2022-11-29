import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { createNameFile } from './utils.js';

const pageloader = (url, pathFile = process.cwd()) => {
  const nameFile = createNameFile(url);
  const pathFull = path.join(pathFile, nameFile);
  return fs.stat(pathFile)
    .catch(() => fs.mkdir(pathFile))
    .then(() => axios.get(url))
    .then((response) => {
      fs.writeFile(pathFull, response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
export default pageloader;
