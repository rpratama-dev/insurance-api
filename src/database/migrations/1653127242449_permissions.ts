import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();

      table.bigInteger('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table.bigInteger('resource_id').unsigned().references('id').inTable('resources').onDelete('CASCADE');
      table.json('permission');

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
