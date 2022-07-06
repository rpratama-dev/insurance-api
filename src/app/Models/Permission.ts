import { column } from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';

export default class Permission extends CustomModel {
  @column()
  public role_id: number;

  @column()
  public resource_id: number;

  @column()
  public permission: object;
}
