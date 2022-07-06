import { column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';
import User from './User';

export default class Organization extends CustomModel {
  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public address: string;

  @column()
  public phone_number: string | null;

  @column()
  public email: string;

  @column()
  public latitude: number;

  @column()
  public logtitude: number;

  @manyToMany(() => User, {
    localKey: 'id', // id column on "Organization" model
    relatedKey: 'id', // id column on "User" model
    pivotTable: 'user_roles', // Table relation users and roles
    pivotForeignKey: 'org_id', // id column "Organization" on "UserRole" Model
    pivotRelatedForeignKey: 'user_id' // id column "User" on "UserRole" Model
  })
  public users: ManyToMany<typeof User>;
}
