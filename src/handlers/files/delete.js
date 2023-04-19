/* eslint-disable no-underscore-dangle */
import { resolve } from 'path';
import fs from 'fs';
import getUser from '../../util/getUser.js';
import Files from '../../models/Files.js';

function serverError(res) {
  res.status(500).json({
    message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.',
  });
}

function unauthorized(res) {
  res.status(401).json({
    message: 'Authorization header missing or invalid.',
  });
}

// eslint-disable-next-line consistent-return
export default async (req, res) => {
  const User = await getUser('APIKey', req.headers.authorization);

  if (!User) return unauthorized(res);

  try {
    const File = await Files.findOne({ Name: req.params.file }).exec();

    if (!File) return res.status(404).json({ message: `File with name ${req.params.file} not found.` });
    if (File.Author !== User.Username) return unauthorized(res);

    const { Author, Name, Type } = File;

    fs.unlink(resolve(`../files/${Author}/${Name}.${Type}`), async (err) => {
      if (!err || err.code === 'ENOENT') {
        await Files.findByIdAndDelete(File._id);
        return res.status(200).json({ message: 'File successfully deleted.' });
      }
      return serverError(res);
    });
  } catch (e) {
    return serverError(res);
  }
};
