import { HttpContext } from '@adonisjs/core/build/standalone';
import * as orm from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

const { BaseModel, beforeCreate, beforeFetch, beforeFind, column } = orm;
const { beforePaginate, beforeUpdate } = orm;

const softDeleteQuery = (query: orm.ModelQueryBuilderContract<typeof BaseModel>) => {
  query.whereNull(`${query.model.table}.deleted_at`);
};

const softDelete = async (row: CustomModel, username?: string) => {
  row.deleted_by = username || 'unknown';
  row.deleted_at = DateTime.local();
  // row['order'] = null
  await row.save();
};

const includeDeleted = (query: any) => {
  // if (query['ignoreDeleted'] === false) return query
  query['ignoreDeleted'] = false;
  return query;
};

export default class CustomModel extends BaseModel {
  @column({ isPrimary: true })
  public id: string | number;

  @column()
  public uuid: string;

  @column()
  public is_active: boolean;

  @column()
  public created_by: string | null;

  @column()
  public updated_by: string | null;

  @column()
  public deleted_by?: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at?: DateTime | null;

  // Hooks

  @beforeFind()
  public static softDeletesFind = softDeleteQuery;

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery;

  @beforePaginate()
  public static softDeletesPaginate([countQuery, query]) {
    countQuery['ignoreDeleted'] = query['ignoreDeleted'];
    softDeleteQuery(countQuery);
  }

  // @beforeSave()
  // public static checkUpdate(model: CustomModel) {
  //   if (!model.$dirty.publish_at) {
  //     model.updatedAt = DateTime.local()
  //   }
  // }

  @beforeCreate()
  public static setCreatedBy(model: CustomModel) {
    model.created_by = HttpContext.get()?.auth.user?.uuid || null;
    model.updated_by = model.created_by;
    model.uuid = uuid();
  }

  @beforeUpdate()
  public static setUpdatedBy(model: CustomModel) {
    model.updated_by = HttpContext.get()?.auth.user?.uuid || null;
  }

  // @orm.computed()
  // public get dateFormatter() {
  //   const formats = {
  //     created_at: this.created_at ? this.created_at.toFormat('dd MMM yyyy', { locale: 'id' }) : null,
  //     updated_at: this.updated_at ? this.updated_at.toFormat('dd MMM yyyy', { locale: 'id' }) : null
  //   };
  //   return formats;
  // }

  // Other Method

  public get trashed(): boolean {
    return this.deleted_at !== null;
  }

  public static withTrashed<Model extends typeof CustomModel>(this: Model): orm.ModelQueryBuilderContract<Model> {
    return includeDeleted(this.query());
  }

  public async delete(deleteBy?: string) {
    await softDelete(this, deleteBy);
  }
}
