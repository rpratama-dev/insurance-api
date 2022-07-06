import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      // Get Default schema for migration
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();

      table.string('name', 100).notNullable();
      table.string('email', 100).notNullable().unique();
      table.string('phone_number', 15).notNullable().unique();
      table.string('password', 255).notNullable();
      table.boolean('remember_me_token').nullable().defaultTo(false);
      table.boolean('is_verified').nullable().defaultTo(false);
      table.timestamp('last_login', { useTz: true }).nullable().defaultTo(null);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      customeSchema.defaultWithOptionals();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
