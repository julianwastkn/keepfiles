import Links from '../../models/Links.js';

export default async (req, res) => {
  const reqURL = decodeURIComponent(req.url);
  const pattern = /\/l\/(?!.*(\.\.|\/))(.+)/;

  if (reqURL.match(pattern)) {
    const link = await Links.findOne({ Identifier: req.params.link }).exec();
    if (!link) return res.status(404).json({ message: 'Link not found.' });
    res.redirect(301, link.redirect);
  } else {
    return res.status(400).json({ message: 'Request did not follow expected format.' });
  }
  return res.end();
};
