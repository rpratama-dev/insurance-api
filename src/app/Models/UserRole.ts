import { column } from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';

export default class UserRole extends CustomModel {
  @column()
  public user_id: number;

  @column()
  public role_id: number;

  @column()
  public org_id: number;
}
