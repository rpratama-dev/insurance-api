// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ErrorHandler from 'App/Exceptions/ErrorHandler';
import UserRole from 'App/Models/UserRole';
import { userRoleSchema, getSchemaStore, getSchemaUpdate } from 'App/Validators/User/UserRoleValidator';
import CustomController from 'Traits/CustomController';

export default class UserRolesController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'user_roles',
        selectedField: ['*'],
        searchField: ['uuid']
      },
      schema: {
        create: userRoleSchema.create,
        update: userRoleSchema.update,
        patch: userRoleSchema.patch
      }
    });
  }

  public async store(ctx: HttpContextContract): Promise<any> {
    const { request: req, response: res } = ctx;
    const payload = await req.validate({
      ...getSchemaStore(ctx),
      data: req.body()
    });

    const existUserRole = await UserRole.query()
      .where('user_id', payload.user_id)
      .where('role_id', payload.role_id)
      .first();
    if (existUserRole) throw new ErrorHandler(400, 'User and Role is exists');

    const role = await UserRole.create({ ...payload });

    const message = 'Success update user role';
    this.responseSuccess(res, { data: role, message, httpStatusCode: 201 });
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

    const permission = await UserRole.create({ ...payload.body });

    const message = 'Success update user role';
    this.responseSuccess(res, {
      data: permission,
      message,
      httpStatusCode: 201
    });
  }
}
