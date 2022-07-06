// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { GeneralValidator } from 'App/Validators/GeneralValidator';
import CustomController from 'Traits/CustomController';

export default class HttpRequestLogController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'http_request_logs',
        selectedField: ['*'],
        searchField: ['stack', 'route', 'request_by_mail']
      },
      schema: {
        // TODO: Update this validator if routes contain create, update, patch
        // Curently route create, update, patch not provide for this controller
        create: GeneralValidator.params,
        update: GeneralValidator.params,
        patch: GeneralValidator.params
      },
      saveLog: false
    });
  }
}
