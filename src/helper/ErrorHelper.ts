import { HttpStatus, HttpStatusCode } from 'App/Exceptions/ErrorHandler';

type TResponseJSON = {
  message: string;
  statusCode: HttpStatusCode;
  statusText: string;
  data: Record<string, any>;
};

class ErrorHelper {
  #err: any;
  #response: TResponseJSON = {
    message: 'Route Not Found',
    statusCode: 400,
    statusText: HttpStatus[400],
    data: {}
  };

  constructor(error: any) {
    this.#err = error;
  }

  public parse(): TResponseJSON | null {
    switch (this.#err.code) {
      case 'E_UNAUTHORIZED_ACCESS': {
        this.#response.message = 'Access Denied';
        this.#response.statusCode = 401;
        this.#response.statusText = HttpStatus[401];
        return this.#response;
      }
      case 'E_ROUTE_NOT_FOUND':
        this.#response.statusCode = 404;
        this.#response.statusText = HttpStatus[404];
        return this.#response;
      case 'E_VALIDATION_FAILURE': {
        const temps = {};
        this.#err.messages.errors.forEach((el) => {
          temps[el.field] = el.message;
        });
        this.#response.message = 'Validation Failded, see error data';
        this.#response.data = {
          errorCode: 'VALIDATION_FAILURE',
          errMsg: temps
        };
        return this.#response;
      }
      case '42703': {
        this.#response.message = 'Column does not exist';
        this.#response.data = this.#err.messages;
        return this.#response;
      }
      default:
        break;
    }
    return null;
  }
}

export default ErrorHelper;
