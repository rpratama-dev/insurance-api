import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import CustomSchema from 'Traits/CustomSchema';

export default class extends BaseSchema {
  protected tableName = 'http_request_logs';

  public async up() {
    this.schema.createTable(this.tableName, (tb) => {
      const customeSchema = new CustomSchema(tb);
      const table = customeSchema.defaultID();

      table.enum('level', ['info', 'error', 'warning']); // .('level');
      table.string('stack', 10000).nullable();
      table.timestamp('request_at', { useTz: true });
      table.bigInteger('timestamp');
      table.string('ip_address', 16);
      table.string('origin', 80).nullable();
      table.string('user_agent', 255);
      table.string('method', 8);
      table.string('route', 150);
      table.string('scope', 150);
      table.float('duration');
      table.string('request_by_mail', 100).nullable();
      table.json('request_headers');
      table.json('request_params');
      table.json('request_query');
      table.json('request_body');
      table.json('response_body');
      table.integer('response_status');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      customeSchema.defaultWithOptionals();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
