// src/db/index.ts

import { Client } from 'pg';

export const database = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  // password: process.env.DB_PASSWORD, // Uncomment if password is needed
  port: 5432,
});

database.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));
