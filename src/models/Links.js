import { model, Schema } from 'mongoose';

export default model('Link', Schema({
  Author: { type: String, required: true },
  Identifier: { type: String, required: true },
  Redirect: { type: String, required: true },
}), 'Links');
