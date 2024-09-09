
import { Client, QueryConfig, QueryResult, QueryResultRow } from 'pg';
import { ApiError } from './apiResponse';
import { database } from '@database/index'; 

export class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T extends QueryResultRow>(queryConfig: QueryConfig): Promise<QueryResult<T>> {
    try {
      return await database.query<T>(queryConfig); 
    } catch (error) {
      throw new ApiError('Database query error', 500, error);
    }
  }

  public async find<T extends QueryResultRow>(tableName: string, conditions: Partial<T>): Promise<T[]> {
    const whereClause = Object.keys(conditions)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' AND ');

    const values = Object.values(conditions);
    const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;

    return (await this.query<T>({ text: query, values })).rows;
  }

  public async create<T extends QueryResultRow>(tableName: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders}) RETURNING *`;

    return (await this.query<T>({ text: query, values })).rows[0];
  }

  public async update<T extends QueryResultRow>(
    tableName: string,
    data: Partial<T>,
    conditions: Partial<T>
  ): Promise<T> {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    const whereClause = Object.keys(conditions)
      .map((key, i) => `${key} = $${i + Object.keys(data).length + 1}`)
      .join(' AND ');

    const values = [...Object.values(data), ...Object.values(conditions)];
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause} RETURNING *`;

    return (await this.query<T>({ text: query, values })).rows[0];
  }

  public async delete<T extends QueryResultRow>(tableName: string, conditions: Partial<T>): Promise<void> {
    const whereClause = Object.keys(conditions)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' AND ');

    const values = Object.values(conditions);
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;

    await this.query({ text: query, values });
  }

  public async selectAll<T extends QueryResultRow>(tableName: string, ): Promise<T[]> {
    
    const query = `SELECT * FROM ${tableName}`;

    return (await this.query<T>({ text: query })).rows;
  }
}
