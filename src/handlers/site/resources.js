import fs from 'fs';
import mime from 'mime';
import { resolve } from 'path';

export default async (req, res) => {
  const requestedResource = decodeURIComponent(req.url).slice(1);
  const pattern = /\/([a-z0-9]+)\/([a-z-]+(\.min)?)/i;

  if (!requestedResource.includes('..') && requestedResource.match(pattern)) {
    const matches = requestedResource.match(/\/([a-z0-9]+)\/([a-z-]+(\.min)?)/i);
    const reqPath = `./resources/${matches[1]}/${matches[2]}.${matches[1]}`;

    fs.readFile(resolve(reqPath), (err, data) => {
      if (!err) {
        res.writeHead(200, { 'Content-Type': mime.getType(matches[1]) }).write(data);
      } else {
        return res.status(404).json({ message: `Resource ${reqPath} not found.` });
      }
      return res.end();
    });
  }
  // 400 ?
};
