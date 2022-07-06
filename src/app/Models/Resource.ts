import {
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
  ModelObject
} from '@ioc:Adonis/Lucid/Orm';
import CustomModel from 'Traits/CustomModel';
import Permission from './Permission';
import Role from './Role';

export default class Resource extends CustomModel {
  @column()
  public is_parent: boolean;

  @column()
  public parent_id: number | null;

  @column()
  public code: string;

  @column()
  public name_id: string;

  @column()
  public name_en: string;

  @column()
  public description: string;

  @manyToMany(() => Role, {
    localKey: 'id', // id column on "Resource" model
    relatedKey: 'id', // id column on "Role" model
    pivotTable: 'permissions', // The pivotTable property defines the pivot table to query for persisting/fetching related rows.
    pivotForeignKey: 'resource_id',
    pivotRelatedForeignKey: 'role_id',
    pivotColumns: ['permission']
  })
  public roles: ManyToMany<typeof Role>;

  @hasMany(() => Permission, {
    localKey: 'id',
    foreignKey: 'resource_id'
  })
  public permissions: HasMany<typeof Permission>;

  @hasMany(() => Resource, {
    localKey: 'id',
    foreignKey: 'parent_id'
  })
  public childs: HasMany<typeof Resource>;

  @belongsTo(() => Resource, {
    localKey: 'id',
    foreignKey: 'parent_id'
  })
  public parent: BelongsTo<typeof Resource>;

  public toJSON(): ModelObject {
    return {
      ...super.toJSON(),
      permissions: this.$extras.pivot_permission
    };
  }
}
