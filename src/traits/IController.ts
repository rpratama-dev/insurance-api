import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { HttpStatusCode } from 'App/Exceptions/ErrorHandler';

export interface DIParams {
  data: object;
  httpStatusCode?: HttpStatusCode;
  message?: string;
}

export interface DICustomController {
  // protected responseSuccess(res: HttpContextContract['response'], params: DIParams): void
}

export interface DIController extends DICustomController {
  index(context: HttpContextContract): void;
  store(context: HttpContextContract): void;
  show(context: HttpContextContract): void;
  update(context: HttpContextContract): void;
  patch(context: HttpContextContract): void;
  destroy(context: HttpContextContract): void;
}
