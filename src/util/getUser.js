import Users from '../models/Users.js';

export default async (Key, Value) => {
  try {
    const User = await Users.findOne({ [Key]: { $regex: new RegExp(Value, 'i') } }).exec();

    if (User && User.APIKey !== '') return User;

    return false;
  } catch (e) {
    return false;
  }
};
