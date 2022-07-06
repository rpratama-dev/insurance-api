import { column, ManyToMany, manyToMany, ModelObject } from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';
import Organization from './Organization';
import Resource from './Resource';
import User from './User';

export default class Role extends CustomModel {
  @column()
  public key: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @manyToMany(() => User, {
    localKey: 'id', // id column on "Role" model
    relatedKey: 'id', // id column on "User" model
    pivotTable: 'user_roles', // Table relation users and roles
    pivotForeignKey: 'role_id', // id column "Role" on "UserRoleModel"
    pivotRelatedForeignKey: 'user_id' // id column "User" on "UserRoleModel"
    // pivotColumns: ['role_id'], // The pivotTable property defines the pivot table to query for persisting/fetching related rows.
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => Organization, {
    localKey: 'id',
    relatedKey: 'id', // id column on "User" model
    pivotTable: 'user_roles',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'org_id'
    // pivotColumns: ['permission'],
  })
  public organizations: ManyToMany<typeof Organization>;

  @manyToMany(() => Resource, {
    localKey: 'id',
    relatedKey: 'id', // id column on "User" model
    pivotTable: 'permissions',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'resource_id',
    pivotColumns: ['permission']
  })
  public resources: ManyToMany<typeof Resource>;

  public toJSON(): ModelObject {
    return {
      ...super.toJSON(),
      permissions: this.resources?.reduce((res, cur) => {
        return {
          ...res,
          [cur.id]: cur.$extras.pivot_permission
        };
      }, {})
    };
  }
}
