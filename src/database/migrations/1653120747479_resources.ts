import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class Resources extends BaseSchema {
  protected tableName = 'resources';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();

      table.boolean('is_parent').notNullable();
      table.bigInteger('parent_id').notNullable();
      table.string('code', 50).notNullable().unique();
      table.string('name_id', 50).notNullable();
      table.string('name_en', 50).notNullable();
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
