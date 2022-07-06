import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class Organizations extends BaseSchema {
  protected tableName = 'organizations';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();
      table.string('name', 100).notNullable().unique();
      table.string('code', 5).notNullable().unique();
      table.string('address', 255).notNullable();
      table.string('phone_number', 15);
      table.string('email', 80);
      table.float('latitude').notNullable();
      table.float('logtitude').notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      customeSchema.defaults();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
