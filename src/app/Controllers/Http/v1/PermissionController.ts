import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Permission from 'App/Models/Permission';
import { getSchemaStore, getSchemaUpdate, permissionSchema } from 'App/Validators/PermissionValidator';
import CustomController from 'Traits/CustomController';

export default class PermissionController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'permissions',
        selectedField: ['*'],
        searchField: ['code', 'name_id', 'name_en', 'description']
      },
      schema: {
        create: permissionSchema.create,
        update: permissionSchema.update,
        patch: permissionSchema.patch
      }
    });
  }

  public async store(ctx: HttpContextContract): Promise<any> {
    const { request: req, response: res } = ctx;
    const payload = await req.validate({
      ...getSchemaStore(ctx),
      data: req.body()
    });

    // const existRole = await Permission.query()
    //   .where('role_id', payload.role_id)
    //   .where('resource_id', payload.resource_id)
    //   .first()
    // if (existRole) throw new ErrorHandler(400, 'Resource and Role is exists')

    const permission = await Permission.create({ ...payload });

    const message = 'Success update permission';
    this.responseSuccess(res, { data: permission, message, httpStatusCode: 201 });
  }

  public async update(ctx: HttpContextContract): Promise<any> {
    const { request: req, response: res } = ctx;
    const payload = await req.validate({
      ...getSchemaUpdate(ctx),
      data: {
        body: req.body(),
        params: req.params()
      }
    });

    const permission = await Permission.create({ ...payload.body });

    const message = 'Success update permission';
    this.responseSuccess(res, { data: permission, message, httpStatusCode: 201 });
  }
}
