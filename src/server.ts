import express from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import logger from 'utils/logger'; // Ensure this path is correct
import { database } from './database/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
database();

app.use(express.json());

app.get('/', (req, res) => {
  logger.info('Hello world route accessed');
  res.send('Hello, World!');
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
