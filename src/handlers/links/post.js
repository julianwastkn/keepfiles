import Links from '../../models/Links.js';
import getUser from '../../util/getUser.js';
import genIdentifier from '../../util/genIdentifier.js';
import config from '../../../config.js';

export default async (req, res) => {
  const { Username: Author } = await getUser('APIKey', req.headers.authorization);
  if (!Author) {
    return res.status(401).json({
      message: 'Authorization header missing or invalid.',
    });
  }

  const Identifier = await genIdentifier(config.identifierLength, false);
  const Link = await new Links({
    Author,
    Identifier,
    Redirect: req.body.link,
  }).save();

  return res.status(200).send(`${config.url}/l/${Link.Identifier}`);
};
