import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../../config.js';
import Users from '../../../models/Users.js';

const patterns = {
  email: /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/, // Thanks manishsaraan/email-validator =)
  username: /^[A-Z0-9]{3,20}$/i, // A-Z, a-z, 0-9, between 3 and twenty characters
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,35}$/,
  /* All characters besides space, between 8 and 35 characters, must have all of the following:
    * One uppercase letter,
    * One lowercase letter,
    * One number,
    * One special character (No spaces)
  */
};

export default async (req, res) => {
  if (!config.allowSignups) return res.status(403).json({ message: 'Signups for this instance of KeepFiles are closed at this time.' });
  if (!req.body.email || !req.body.username || !req.body.password) return res.status(400).json({ message: 'Missing email, username, and/or password.' });

  const { email: Email, username: Username, password: Password } = req.body;

  if (!Email.match(patterns.email)
  || !Username.match(patterns.username)
  || !Password.match(patterns.password)) {
    return res.status(422).json({ // Show the user exactly why their request failed
      message: 'Username, Email, or Password failed validation.',
      details: {
        email: {
          requirements: 'Must be valid email. See manishsaraan/email-validator on GitHub for details.',
          valid: patterns.email.test(Email),
        },
        username: {
          requirements: 'Alphanumeric (A-Z, a-z, 0-9), and between 3 and 20 characters.',
          valid: patterns.username.test(Username),
        },
        password: {
          requirements: 'At least One Uppercase letter, One lowercase letter, One number, One special character (No spaces), and between 8 and 35 characters.',
          valid: patterns.password.test(Password),
        },
      },
    });
  }

  try {
    const user = await Users.findOne({
      $or: [
        { Username },
        { Email },
      ],
    }).exec();

    if (user) return res.status(409).json({ message: 'Account with provided username or email already exists.' });

    const hashedPw = await hash(Password, 15);

    await new Users({
      Email,
      Username,
      Password: hashedPw,
      PermissionLevel: 0,
      APIKey: '',
      RequestedAccess: false,
    }).save();

    return res.status(200).json({
      token: jwt.sign({ Username, Type: 'Token' }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.' });
  }
};
