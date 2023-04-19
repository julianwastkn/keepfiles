/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getUser from '../../../util/getUser.js';

export default async (req, res) => {
  if (!req.body.username || !req.body.password) return res.status(400).json({ message: 'Request is missing username and/or password.' });

  const User = await getUser('Username', req.body.username);
  if (!User) return res.status(404).json({ message: 'User with provided name does not exist.' });

  bcrypt.compare(req.body.password, User.Password, (err, isCorrect) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.' });
    if (isCorrect === true) {
      res.status(200).json({
        Token: jwt.sign({ Username: User.Username, Type: 'Token' }, process.env.JWT_SECRET, { expiresIn: '1h' }),
        APIKey: User.APIKey,
      });
    } else {
      res.status(401).json({ message: 'Username or password invalid.' });
    }
  });
};
