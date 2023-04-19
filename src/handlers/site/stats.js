import Users from '../../models/Users.js';
import Files from '../../models/Files.js';
import Links from '../../models/Links.js';

export default async (req, res) => {
  try {
    const UsersCount = await Users.countDocuments({}).exec();
    const FilesCount = await Files.countDocuments({}).exec();
    const LinksCount = await Links.countDocuments({}).exec();

    res.status(200).json({
      UsersCount,
      FilesCount,
      LinksCount,
    });
  } catch (err) {
    res.status(500).json({
      UsersCount: 0,
      FilesCount: 0,
      LinksCount: 0,
      Message: 'Internal Server Error. Reach out to your KeepFiles Host about resolving this.',
    });
  }
};
