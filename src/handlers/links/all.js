import getUser from '../../util/getUser.js';
import Links from '../../models/Links.js';

export default async (req, res) => {
  const User = await getUser('APIKey', req.headers.authorization);

  if (User) {
    try {
      const UserLinks = await Links.find({ Author: User.Username }).exec();

      return res.status(200).json(UserLinks.reduce((acc, currentLink) => {
        acc[currentLink.Identifier] = currentLink.Redirect;
        return acc;
      }, {}));
    } catch (e) {
      return res.status(500).json({ message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.' });
    }
  }
  return res.status(401).json({
    message: 'Authorization header missing or invalid.',
  });
};
