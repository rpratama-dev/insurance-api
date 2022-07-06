import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class UserRoles extends BaseSchema {
  protected tableName = 'user_roles';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();

      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.bigInteger('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table.bigInteger('org_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');

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
