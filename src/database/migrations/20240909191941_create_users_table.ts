import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('lastname').notNullable();
    table.string('email').unique().notNullable();
    table.integer('phone').notNullable();
    table.string('password').notNullable();
    table.enum('role', ['admin', 'nurse', 'head_nurse', 'receptionist']).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
