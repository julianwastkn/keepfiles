/* eslint-disable no-bitwise */
import Files from '../models/Files.js';
import Links from '../models/Links.js';

export default async function genIdentifier(length, isFile) {
  const attempt = [...Array(length)].map(() => (Math.random() * 36 | 0).toString(36)).join('');
  try {
    if (isFile) {
      const File = await Files.findOne({ Name: attempt }).exec();
      if (File) return genIdentifier();
    } else {
      const Link = await Links.findOne({ Name: attempt }).exec();
      if (Link) return genIdentifier();
    }
    return attempt;
  } catch (e) {
    return false;
  }
}
