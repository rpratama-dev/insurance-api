// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { organizationSchema } from 'App/Validators/OrganizationValidator';
import CustomController from 'Traits/CustomController';
import PhoneNumber from 'Utils/PhoneNumber';

export default class OrganizationsController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'organizations',
        selectedField: ['*'],
        searchField: ['name', 'code', 'address', 'phone_number', 'email']
      },
      schema: {
        create: organizationSchema.create,
        update: organizationSchema.update,
        patch: organizationSchema.patch
      }
    });
  }

  public async store({ request: req, response: res }: HttpContextContract): Promise<any> {
    const payload = await req.validate({
      ...organizationSchema.create,
      data: { body: req.body(), params: req.params() }
    });
    const ph = new PhoneNumber();
    const item = await this.insertOne({
      ...payload,
      phone_number: ph.parse(payload.phone_number)
    });
    const message = 'Add new item success';
    this.responseSuccess(res, { data: item, message, httpStatusCode: 201 });
  }
}
