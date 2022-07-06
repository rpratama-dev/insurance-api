/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new ErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
import { Exception } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

type Informational = 100 | 101;
type Success = 200 | 201 | 202 | 203 | 204;
type Redirection = 300 | 301 | 302 | 303;
type ClientError1 = 400 | 401 | 402 | 403 | 404 | 405 | 406;
type ClientError2 = 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414;
type ClientError3 = 415 | 416 | 417 | 422 | 425 | 426 | 428 | 429 | 431 | 451 | 499;
type ServerError = 500 | 501 | 502 | 503 | 504 | 505 | 511 | 521;

export type HttpStatusCode =
  | Informational
  | Success
  | Redirection
  | ClientError1
  | ClientError2
  | ClientError3
  | ServerError;

export type THttpStatus = {
  [k in HttpStatusCode]: string;
};

export const HttpStatus: THttpStatus = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-authoritative Information',
  204: 'No Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Access to that resource is forbidden',
  404: 'The requested resource was not found',
  405: 'Method not allowed',
  406: 'Not acceptable response',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'Request URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  422: 'Unprocessable Entity',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable for Legal Reasons',
  499: 'Client Closed Request',
  500: 'There was an error on the server and the request could not be completed',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'The server is unavailable to handle this request right now',
  504: 'The server, acting as a gateway, timed out waiting for another server to respond',
  505: 'HTTP Version Not Supported',
  511: 'Network Authentication Required',
  521: 'Web server is down'
};

export default class ErrorHandler extends Exception {
  #data?: Record<string, any>;

  constructor(status: HttpStatusCode, msg: string, data?: Record<string, any>) {
    super(msg, status);
    this.#data = data;
  }

  public async handle(error: this, ctx: HttpContextContract) {
    const responseJSON = {
      message: error.message || 'Something error, please contact web administrator',
      statusCode: error.status || 500,
      statusText: HttpStatus[error.status] || 'Internal Server Error',
      data: this.#data || {}
    };

    ctx.response.status(error.status).json(responseJSON);
  }
}
