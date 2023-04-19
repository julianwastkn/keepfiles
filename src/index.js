import { config } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import routes from './util/router.js';

config({ path: path.join('../.env') });

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 80;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('', routes);

app.listen(port, host);

// console.log(`Listening on http://${host}:${port}`);
