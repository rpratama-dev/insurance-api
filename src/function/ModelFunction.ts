import { HttpContext } from '@adonisjs/core/build/standalone';
import Database, { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database';
import ErrorHandler from 'App/Exceptions/ErrorHandler';
import { DateTime } from 'luxon';
import { validate as validateUUID, v4 as uuid } from 'uuid';
import * as orm from '@ioc:Adonis/Lucid/Orm';

const { BaseModel } = orm;

type CustomeWhere = (q: DatabaseQueryBuilderContract<any>) => DatabaseQueryBuilderContract<any>;
type CustomeWhereOrm<M extends typeof BaseModel> = (q: orm.ModelQueryBuilderContract<M, InstanceType<M>>) => any;

export type TConfigModelFunction = {
  tableName: string;
  selectedField: string[];
  searchField: string[];
};

type DefaultSchema = {
  uuid?: string;
  is_active?: boolean;
  created_at?: DateTime;
  updated_at?: DateTime;
  deleted_at?: Date | null;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
};

type TQueries = {
  page?: number;
  perPage?: number;
  keyword?: string;
  orderBy?: string;
  sortBy?: 'asc' | 'desc';
  isActive?: 'true' | 'false';
  isPagination?: 'true' | 'false';
};

class ModelFunction {
  public config: TConfigModelFunction;

  constructor(config: TConfigModelFunction) {
    this.config = config;
  }

  public findModelAll<M extends typeof BaseModel>(Model: M, queries: TQueries = {}, customeWhere?: CustomeWhereOrm<M>) {
    let { orderBy, sortBy } = queries;
    const { perPage, page, keyword, isActive } = queries;
    const isPagination = queries.isPagination?.toLowerCase();
    const withPaginate = isPagination ? isPagination === 'true' : true;
    const perPages = withPaginate ? +(perPage || 10) : 999999999;
    const pages = withPaginate ? +(page || 1) : 1;
    const isStartWildcard = this.config.selectedField.includes('*');
    sortBy = ['asc', 'desc'].includes(sortBy || '') ? sortBy : 'desc';
    if (!isStartWildcard) {
      orderBy = this.config.selectedField.includes(orderBy || '') ? orderBy : 'id';
    } else orderBy = orderBy || 'id';

    const model = Model.query()
      .where((q) => {
        if (isActive && (!isStartWildcard || this.config.selectedField.includes('is_active'))) {
          const qIsActive = isActive.toLowerCase();
          if (['true', 'false'].includes(qIsActive)) {
            q.where('is_active', qIsActive === 'true');
          }
        }
      })
      .where((q) => {
        if (keyword) {
          for (const el of this.config.searchField) {
            q.orWhereILike(el, `%${keyword}%`);
          }
        }
        if (customeWhere) customeWhere(q);
      })
      .select(this.config.selectedField)
      .orderBy(orderBy || 'id', sortBy);
    return { model, perPages, pages };
  }

  public async findAll(queries: TQueries = {}, customeWhere?: CustomeWhere): Promise<any> {
    let { orderBy, sortBy } = queries;
    const { perPage, page, keyword, isActive } = queries;
    const isPagination = queries.isPagination?.toLowerCase();
    const withPaginate = isPagination ? isPagination === 'true' : true;
    const perPages = withPaginate ? perPage || 10 : 999999999;
    const pages = withPaginate ? page || 1 : 1;
    const isStartWildcard = this.config.selectedField.includes('*');
    sortBy = ['asc', 'desc'].includes(sortBy || '') ? sortBy : 'desc';
    if (!isStartWildcard) {
      orderBy = this.config.selectedField.includes(orderBy || '') ? orderBy : 'id';
    } else orderBy = orderBy || 'id';
    const items = await Database.from(this.config.tableName)
      .where((q) => {
        if (isActive && (!isStartWildcard || this.config.selectedField.includes('is_active'))) {
          const qIsActive = isActive.toLowerCase();
          if (['true', 'false'].includes(qIsActive)) {
            q.where('is_active', qIsActive === 'true');
          }
        }
      })
      .where((q) => {
        if (keyword) {
          for (const el of this.config.searchField) {
            q.orWhereILike(el, `%${keyword}%`);
          }
        }
        q.whereNull('deleted_at');
        if (customeWhere) customeWhere(q);
      })
      .select(this.config.selectedField)
      .orderBy(orderBy || 'id', sortBy)
      .paginate(+pages, +perPages);
    const newItems = {
      meta: items.getMeta(),
      rows: items.all()
    };
    return newItems;
  }

  public async findByID(itemId: string | number) {
    console.log({ table: this.config.tableName });
    const item = await Database.from(this.config.tableName)
      .select(this.config.selectedField)
      .where((q) => {
        if (validateUUID(String(itemId))) q.where('uuid', itemId);
        else if (!Number.isNaN(+itemId)) q.where('id', itemId);
        else q.where('id', -1);
      });
    if (!item[0]) throw new ErrorHandler(404, `Resources with id: ${itemId} not found`);
    return item[0];
  }

  public async findBy(objField: object, firstOnly = false, customeWhere?: CustomeWhere) {
    let item: any = [];
    const builder = Database.from(this.config.tableName)
      .select(this.config.selectedField)
      .where((q) => {
        q.where(objField);
        if (customeWhere) customeWhere(q);
      });
    if (firstOnly) item = await builder.first();
    else item = await builder.exec();
    if (!Array.isArray(item)) item = item ? [item] : [];
    if (firstOnly && !item[0]) throw new ErrorHandler(404, 'The resource you are looking for does not exist');
    if (firstOnly) return item[0];
    return item;
  }

  public async insertOne<T extends DefaultSchema>(payload: T) {
    payload.uuid = uuid();
    payload.created_by = HttpContext.get()?.auth.user?.uuid || null;
    payload.updated_by = payload.created_by;
    payload.created_at = DateTime.now();
    payload.updated_at = DateTime.now();
    if (payload.is_active === undefined) payload.is_active = true;
    const item = await Database.table(this.config.tableName).returning(this.config.selectedField).insert(payload);
    return item;
  }

  public async updateOne(itemId: string | number, payload: object) {
    const item = await Database.from(this.config.tableName)
      .where((q) => {
        if (validateUUID(String(itemId))) q.where('uuid', itemId);
        else if (!Number.isNaN(+itemId)) q.where('id', itemId);
        else q.where('id', -1);
      })
      .update(
        payload, // Payload to updated
        this.config.selectedField // columns to return
      );
    return item;
  }

  public async destroyOne(itemId: string | number, deleteBy: string | null) {
    const item = await this.updateOne(itemId, {
      deleted_at: new Date(),
      deleted_by: deleteBy
    });
    return item;
  }
}

export default ModelFunction;
