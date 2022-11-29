import path from 'path';

const createNameFile = (url) => {
  const nameFile = `${url.split('//')[1].replace(/[^a-z0-9]/ig, '-')}.html`;
  return nameFile;
};

const pathDownloaded = (url, pathDown) => {
  const pathDownload = path.join(pathDown, createNameFile(url));
  return pathDownload;
};

export { createNameFile, pathDownloaded };
