import { Knex } from 'knex';

class CustomSchema {
  #table: Knex.CreateTableBuilder;

  constructor(table: Knex.CreateTableBuilder) {
    this.#table = table;
  }
  // default additional table
  public defaultID() {
    this.#table.bigIncrements('id').primary();
    this.#table.uuid('uuid').index().unique().notNullable();
    return this.#table;
  }

  public defaults() {
    this.#table.boolean('is_active').defaultTo(true);
    this.#table.timestamp('created_at', { useTz: true }).notNullable();
    this.#table.timestamp('updated_at', { useTz: true }).notNullable();
    this.#table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null);
    this.#table.uuid('created_by').notNullable().unsigned().references('uuid').inTable('users');
    this.#table.uuid('updated_by').notNullable().unsigned().references('uuid').inTable('users');
    this.#table.uuid('deleted_by').nullable().unsigned().references('uuid').inTable('users');
    return this.#table;
  }

  public defaultWithOptionals() {
    this.#table.boolean('is_active').defaultTo(true);
    this.#table.timestamp('created_at', { useTz: true }).notNullable();
    this.#table.timestamp('updated_at', { useTz: true }).notNullable();
    this.#table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null);
    this.#table.uuid('created_by').nullable().defaultTo(null);
    this.#table.uuid('updated_by').nullable().defaultTo(null);
    this.#table.uuid('deleted_by').nullable().defaultTo(null);
    return this.#table;
  }
}

export default CustomSchema;
