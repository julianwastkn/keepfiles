import getUser from '../../util/getUser.js';
import Files from '../../models/Files.js';

export default async (req, res) => {
  const User = await getUser('APIKey', req.headers.authorization);

  if (User) {
    try {
      const UserFiles = await Files.find({ Author: User.Username }).exec();

      return res.status(200).json(UserFiles.reduce((acc, currentFile) => {
        acc[currentFile.Name] = currentFile.Type;
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
