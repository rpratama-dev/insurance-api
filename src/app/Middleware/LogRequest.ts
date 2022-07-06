import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { performance } from 'perf_hooks';
import { DateTime } from 'luxon';
import CustomLogger from 'Traits/CustomLogger';
import HttpRequestLog from 'App/Models/HttpRequestLog';

export default class LogRequest {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const start = performance.now();
    const realIp = ctx.request.header('x-real-ip') || ctx.request.header('x-forwarded-for');
    const userAgent = ctx.request.header('user-agent');
    const date = DateTime.local().setZone('Asia/Jakarta');
    const origin = ctx.request.header('origin'); // If same Origin get Host

    ctx.response.response.on('finish', () => {
      const stringify = (meta: object) => {
        const masked = ['password', 'authorization', 'cookie', 'token'];
        return JSON.stringify(
          meta,
          (k, v) => {
            if (masked.includes(k)) return '██████████';
            return v;
          },
          2
        );
      };

      const log = stringify({
        level: ctx.request['errorStack'] ? 'error' : 'info',
        stack: (ctx.request['errorStack'] || '').split('\n')[0],
        request_at: date,
        timestamp: date.toMillis(),
        ip_address: realIp || ctx.request.ip(),
        origin: origin || null,
        user_agent: userAgent,
        method: ctx.request.method(),
        route: ctx.request.url(),
        scope: typeof ctx.route?.handler === 'string' ? ctx.route.handler : 'other',
        duration: performance.now() - start,
        request_by_mail: ctx.auth?.user?.email,
        request_headers: null, // ctx.request.headers(),
        request_params: ctx.params,
        request_query: ctx.request['requestData'],
        request_body: ctx.request.body(),
        response_body: ctx.response.getBody(),
        response_status: ctx.response.getStatus()
      });
      console.log(log);

      const saveLog = typeof ctx.response['saveHttpLog'] === 'boolean';
      const isSaveLog = saveLog ? ctx.response['saveHttpLog'] : true;
      // if (isSaveLog) HttpRequestLog.create(JSON.parse(log));
      CustomLogger.info('HttpRequest', { meta: JSON.parse(log) });
    });
    await next();
  }
}

const test = {
  level: 'error',
  stack:
    'ValidationException: E_VALIDATION_FAILURE: Validation Exception\n    at ApiErrorReporter.toError (/home/satria/sideup-project/insurance-app/insurance-api/node_modules/.pnpm/@adonisjs+validator@12.3.2_ocze4c4rza6luoiwytccwnfyte/node_modules/@adonisjs/validator/build/src/ErrorReporter/Api.js:49:16)\n    at eval (eval at compile (/home/satria/sideup-project/insurance-app/insurance-api/node_modules/.pnpm/@adonisjs+validator@12.3.2_ocze4c4rza6luoiwytccwnfyte/node_modules/@adonisjs/validator/build/src/Compiler/index.js:217:16), <anonymous>:132:31)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at Request.validateRequest [as validate] (/home/satria/sideup-project/insurance-app/insurance-api/node_modules/.pnpm/@adonisjs+validator@12.3.2_ocze4c4rza6luoiwytccwnfyte/node_modules/@adonisjs/validator/build/src/Bindings/Request.js:48:31)\n    at ResourcesController.store (/home/satria/sideup-project/insurance-app/insurance-api/src/traits/CustomController.ts:47:21)\n    at Object.PreCompiler.runRouteHandler [as fn] (/home/satria/sideup-project/insurance-app/insurance-api/node_modules/.pnpm/@adonisjs+http-server@5.11.0_wfecxmd3ufg6hfkr77uocjzjuq/node_modules/@adonisjs/http-server/build/src/Server/PreCompiler/index.js:47:31)\n    at AuthMiddleware.handle (/home/satria/sideup-project/insurance-app/insurance-api/src/app/Middleware/Auth.ts:70:5)\n    at LogRequest.handle (/home/satria/sideup-project/insurance-app/insurance-api/src/app/Middleware/LogRequest.ts:56:5)\n    at Server.handleRequest (/home/satria/sideup-project/insurance-app/insurance-api/node_modules/.pnpm/@adonisjs+http-server@5.11.0_wfecxmd3ufg6hfkr77uocjzjuq/node_modules/@adonisjs/http-server/build/src/Server/index.js:108:13)',
  request_at: '2022-06-30T17:17:24.134+07:00',
  timestamp: 1656584244134,
  ip_address: '127.0.0.1',
  origin: 'http://localhost:3001',
  user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  method: 'POST',
  route: '/api/v1/resources',
  scope: 'ResourcesController.store',
  duration: 132.0296650007367,
  request_by_mail: 'superadmin@mail.com',
  request_headers: {
    'host': 'localhost:3333',
    'connection': 'keep-alive',
    'content-length': '102',
    'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    'sec-ch-ua-mobile': '?0',
    'authorization': '██████████',
    'content-type': 'application/json',
    'accept': 'application/json',
    'user-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'cache-control': 'no-cache',
    'sec-ch-ua-platform': '"Linux"',
    'origin': 'http://localhost:3001',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'http://localhost:3001/',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,id;q=0.8',
    'cookie': '██████████',
    'x-request-id': 'cl50vhj4e0000zhqe8f5q7brv'
  },
  request_params: {},
  request_query: {
    is_parent: false,
    parent_id: 3,
    code: 'user-roles',
    name_id: 'as',
    name_en: 'as',
    description: 'as'
  },
  request_body: {
    is_parent: false,
    parent_id: 3,
    code: 'user-roles',
    name_id: 'as',
    name_en: 'as',
    description: 'as'
  },
  response_body: 'E_VALIDATION_FAILURE: Validation Exception',
  response_status: 422
};
