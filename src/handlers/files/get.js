import { createReadStream } from 'fs';
import mime from 'mime';
import Files from '../../models/Files.js';

export default async (req, res) => {
  const request = decodeURIComponent(req.url);
  const pattern = /^\/f\/(?!.*(\.\.|\/))(.+)(\.[a-z0-9]+)?$/i;

  if (request.match(pattern)) {
    const file = await Files.findOne({ Name: req.params.file.split('.')[0] }).exec();

    if (!file) return res.status(404).json({ message: 'File not found.' });

    const { Author, Name, Type } = file;

    return createReadStream(`../files/${Author}/${Name}.${Type}`)
      .on('open', () => {
        res.setHeader('Content-Type', mime.getType(Type));
      })
      .on('error', () => res.status(500).json({ message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.' }))
      .pipe(res);
  }
  return res.status(400).json({ message: 'Request did not follow expected format.' });
};
