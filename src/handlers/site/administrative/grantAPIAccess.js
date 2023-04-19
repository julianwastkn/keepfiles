import { randomBytes } from 'crypto';
import getUser from '../../../util/getUser.js';
import config from '../../../../config.js';

const { GrantAPIAccessAndPrivileged } = config.PermissionLevels;

export default async (req, res) => {
  const Issuer = await getUser('APIKey', req.headers.authorization);
  if (!Issuer || Issuer.PermissionLevel < GrantAPIAccessAndPrivileged) {
    if (req.body.receiver.toLowerCase() !== Issuer.Username.toLowerCase() || !Issuer.APIKey) {
      // Let previously authorized users re-issue their own API keys.
      return res.status(401).json({
        message: 'Authorization header missing or invalid.',
      });
    }
  }

  const Receiver = await getUser('Username', req.body.receiver);

  if (!Receiver) {
    return res.status(404).json({
      message: 'Provided user could not be found.',
    });
  }

  Receiver.APIKey = randomBytes(34).toString('hex');

  try {
    await Receiver.save();
    return res.status(200).json({ APIKey: Receiver.APIKey });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.' });
  }
};
