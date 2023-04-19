import { model, Schema } from 'mongoose';

export default model('User', Schema({
  Email: { type: String, required: true },
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  PermissionLevel: { type: Number, required: true },
  APIKey: { type: String },
  RequestedAccess: { type: Boolean, required: true },
}), 'Users');
