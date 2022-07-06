import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class Roles extends BaseSchema {
  protected tableName = 'roles';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();

      table.string('key', 30).notNullable().unique();
      table.string('name', 50).notNullable();
      table.string('description', 255).notNullable();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      customeSchema.defaults();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
