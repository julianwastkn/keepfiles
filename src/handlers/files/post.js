import { createWriteStream } from 'fs';
import { resolve } from 'path';
import mime from 'mime';
import Files from '../../models/Files.js';
import getUser from '../../util/getUser.js';
import genIdentifier from '../../util/genIdentifier.js';
import config from '../../../config.js';

function serverError(res) {
  res.status(500).json({ message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.' });
}

export default async (req, res) => {
  mime.define({ 'audio/mpeg': ['mp3'] }, true);

  const User = await getUser('APIKey', req.headers.authorization);
  const Name = await genIdentifier(config.identifierLength, true);
  const Type = mime.getExtension(req.file.mimetype);

  if (!Name) return serverError(res);

  if (!User) {
    return res.status(401).json({
      message: 'Authorization header missing or invalid.',
    });
  }

  if (req.file.size > config.maxFileSize
    && User.PermissionLevel < config.PermissionLevels.UnlimitedFileSize) {
    return res.status(413).json({ message: `Upload exceeds maximum file size of ${config.maxFileSize} MB.` });
  }

  try {
    await new Files({
      Author: User.Username,
      Name,
      Type,
    }).save();

    const writeStream = createWriteStream(resolve(`../files/${User.Username}/${Name}.${Type}`));

    writeStream.write(req.file.buffer);
    writeStream.end();

    writeStream.on('finish', () => res.status(200).json({
      Author: User.Username,
      Name,
      Type,
      Link: `${config.url}/f/${Name}.${Type}`,
    }));

    writeStream.on('error', () => serverError(res));
  } catch (e) {
    serverError(res);
  }
  return true;
};
