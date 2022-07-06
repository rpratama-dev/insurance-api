import { beforeSave, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';
import CustomModel from 'Traits/CustomModel';
import hashConfig from 'Config/hash';
import { DateTime } from 'luxon';
import ApiToken from './ApiToken';
import Role from './Role';
import Organization from './Organization';

export default class User extends CustomModel {
  public static table = 'users';

  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public phone_number: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public remember_me_token?: string;

  @column()
  public is_verified: boolean | null;

  @column()
  public last_login: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.use(hashConfig.default).make(user.password);
    }
  }

  @hasMany(() => ApiToken, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public tokens: HasMany<typeof ApiToken>;

  @manyToMany(() => Role, {
    localKey: 'id', // id column on "User" model
    relatedKey: 'id', // id column on "Role" model
    pivotTable: 'user_roles', // Table relation users and roles
    pivotForeignKey: 'user_id', // id column "User" on "UserRoleModel"
    pivotRelatedForeignKey: 'role_id' // id column "Role" on "UserRoleModel"
    // pivotColumns: ['role_id'], // The pivotTable property defines the pivot table to query for persisting/fetching related rows.
  })
  public roles: ManyToMany<typeof Role>;

  @manyToMany(() => Organization, {
    localKey: 'id', // id column on "User" model
    relatedKey: 'id', // id column on "Organization" model
    pivotTable: 'user_roles', // Table relation users and roles
    pivotForeignKey: 'user_id', // id column "User" on "UserRoleModel"
    pivotRelatedForeignKey: 'org_id' // id column "Organization" on "UserRole" Model
    // pivotColumns: ['role_id'], // The pivotTable property defines the pivot table to query for persisting/fetching related rows.
  })
  public organizations: ManyToMany<typeof Organization>;
}
