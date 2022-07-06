import { DateTime } from 'luxon';
import { column } from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';

export default class HttpRequestLog extends CustomModel {
  @column()
  public level: 'info' | string;

  @column()
  public stack: string | null;

  @column()
  public request_at: DateTime;

  @column()
  public timestamp: number;

  @column()
  public ip_address: string;

  @column()
  public origin: string | null;

  @column()
  public user_agent: string;

  @column()
  public method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  @column()
  public route: string;

  @column()
  public scope: string;

  @column()
  public duration: number;

  @column()
  public request_by_mail: string;

  @column()
  public request_by_uuid: string;

  @column()
  public request_headers: object;

  @column()
  public request_params: object;

  @column()
  public request_query: object;

  @column()
  public request_body: object;

  @column()
  public response_body: object;

  @column()
  public response_status: number;
}
