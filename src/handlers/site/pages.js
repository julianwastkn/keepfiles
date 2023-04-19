import fs from 'fs';
import { resolve } from 'path';

export default async (req, res) => {
  const requestedPage = decodeURIComponent(req.url).slice(1);
  const pattern = /^[A-Z0-9-\s]+$/i;
  let url = requestedPage.split('.')[0];
  if (!url) url = 'index';

  if (!pattern.test(url)) return res.status(400).json({ message: 'Request did not follow expected format.' });

  fs.readFile(resolve(`./resources/html/${url}.html`), (err, data) => {
    if (err) {
      return res.status(404).json({ message: 'Requested resource does not exist.' });
    }

    res.write(data);
    return res.end();
  });
};
