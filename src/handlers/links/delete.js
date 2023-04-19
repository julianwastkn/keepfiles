/* eslint-disable no-underscore-dangle */
import getUser from '../../util/getUser.js';
import Links from '../../models/Links.js';

export default async (req, res) => {
  const User = await getUser('APIKey', req.headers.authorization);

  try {
    const Link = await Links.findOne({ Identifier: req.params.link }).exec();

    if (!Link) return res.status(404).json({ message: `Link with name ${req.params.link} not found.` });
    if (!User || Link.Author !== User.Username) return res.status(401).json({ message: 'Authorization header missing or invalid.' });

    await Links.findByIdAndDelete(Link._id);
    return res.status(200).json({ message: 'Link successfully deleted.' });
  } catch (e) {
    return res.status(500).json({
      message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.',
    });
  }
};
