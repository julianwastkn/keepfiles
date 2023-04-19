import { model, Schema } from 'mongoose';

export default model('Files', Schema({
  Author: { type: String, required: true },
  Name: { type: String, required: true },
  Type: { type: String, required: true },
}), 'Files');
