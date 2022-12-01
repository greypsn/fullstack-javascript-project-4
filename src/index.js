import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import * as cheerio from 'cheerio';
import debug from 'debug';
import configDebug from 'axios-debug-log';
import Listr from 'listr';
import { urlFile, urlDirectory } from './utils.js';

const log = debug('page-loader');

configDebug({
  request(debugAxios, config) {
    debugAxios(`Request with ${config.headers['content-type']})`);
  },
  response(debugAxios, response) {
    debugAxios(`Response with ${response.headers['content-type']}`, `from ${response.config.url}`);
  },
  error(debugAxios, error) {
    debugAxios('Boom', error);
  },
});

const downloadFile = (pathFile, url, src) => {
  const pathFilesHtml = path.join(pathFile, urlDirectory(url));
  const fileName = urlFile(path.join(url, src));
  axios.get(path.join(url, src), { responseType: 'stream', validateStatus: (status) => status === 200 })
    .then((response) => fs.writeFile(path.join(pathFilesHtml, fileName), response.data))
    .catch((error) => console.log(error));
};

const downloadFiles = (urls, url, pathFile) => {
  const pathFilesHtml = path.join(pathFile, urlDirectory(url));
  return fs.stat(pathFilesHtml)
    .catch(() => fs.mkdir(pathFilesHtml))
    .then(() => {
      const tasks = urls.map((el) => {
        const task = downloadFile(pathFile, url, el);
        return { title: url + el, task: () => task };
      });
      const taskRun = new Listr(tasks, { concurrent: true });
      return taskRun.run();
    })
    .catch((error) => console.log(error));
};

const preparationHtml = (html, url) => {
  const tagsAttr = { link: 'href', script: 'src', img: 'src' };
  const tagsKey = Object.keys(tagsAttr);
  const urlsDownload = [];
  const $ = cheerio.load(html);
  tagsKey.map((tag) => {
    $(tag).each(function () {
      const urlDownload = $(this).attr(tagsAttr[tag]);
      urlsDownload.push(urlDownload);
      $(this).attr(tagsAttr[tag], path.join(urlDirectory(url), urlFile(url + urlDownload)));
    });
    return true;
  });
  return { html: $.html(), urls: urlsDownload };
};

const pageloader = (url, pathFile = process.cwd()) => {
  const nameFile = urlFile(url);
  const pathFull = path.join(pathFile, nameFile);
  return fs.stat(pathFile)
    .catch(() => fs.mkdir(pathFile))
    .then(() => axios.get(url, { validateStatus: (status) => status === 200 }))
    .then((response) => {
      const { html, urls } = preparationHtml(response.data, url);
      log(`write file to ${pathFull}`);
      return fs.writeFile(pathFull, html).then(() => urls); // проброс urls дальше
    })
    .then((urls) => {
      log(`write files to ${pathFile}`);
      return downloadFiles(urls, url, pathFile);
    });
};
export default pageloader;
