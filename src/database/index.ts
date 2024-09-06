import { Client } from 'pg';

export const database = () => {
   const client = new Client({
    user: process.env.DB_USER,
    host:  process.env.DB_HOST,
    database:  process.env.DB_DATABASE,
    // password: process.env.user,
    port: 5432,
  });
  
  // Connect to PostgreSQL
  client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));
}