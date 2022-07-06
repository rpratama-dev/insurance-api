import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class AppInfos extends BaseSchema {
  protected tableName = 'app_infos';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();
      table.string('name', 100).notNullable();
      table.string('slogan', 255).notNullable();
      table.string('logo', 255).notNullable();
      table.string('phone_number', 15).notNullable();
      table.string('mobile_number', 15).nullable().defaultTo(null);
      table.string('email', 80).notNullable();
      table.string('sosmed_facebook', 80).nullable().defaultTo(null);
      table.string('sosmed_instagram', 80).nullable().defaultTo(null);
      table.string('sosmed_linkedin', 80).nullable().defaultTo(null);
      table.string('sosmed_youtube', 80).nullable().defaultTo(null);

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
