// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from '@adonisjs/core/build/standalone';
import Resource from 'App/Models/Resource';
import { GeneralValidator } from 'App/Validators/GeneralValidator';
import { resourceSchema } from 'App/Validators/ResourceValidator';
import CustomController from 'Traits/CustomController';

export default class ResourcesController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'resources',
        selectedField: ['*'],
        searchField: ['code', 'name_id', 'name_en', 'description']
      },
      schema: {
        create: resourceSchema.create,
        update: resourceSchema.update,
        patch: resourceSchema.patch
      }
    });
  }

  public async index({ request: req, response: res }: HttpContext): Promise<any> {
    let items: Resource[];
    const isParent = req.input('isParent', undefined);
    const query = await req.validate({ ...GeneralValidator.index, data: req['requestData'] });
    if (!query.isPagination) query.isPagination = 'true';
    const { model, ...other } = this.findModelAll(Resource, query, (q) => {
      q.if(isParent !== undefined, () => {
        q.where('is_parent', isParent === 'true');
      });
    });
    const fields = ['id', 'uuid', 'code', 'name_id', 'name_en', 'is_active'];
    model
      .preload('childs', (child) => {
        child.select(fields);
      })
      .preload('parent', (parent) => {
        parent.select(fields);
      });
    if (query.isPagination === 'true') {
      const temp = await model.paginate(+other.pages, +other.perPages);
      const newItems = {
        meta: temp.getMeta(),
        rows: temp.all()
      };
      this.responseSuccess(res, { data: newItems }, this.saveLog);
    } else {
      items = await model.exec();
      this.responseSuccess(res, { data: items }, this.saveLog);
    }
  }
}
