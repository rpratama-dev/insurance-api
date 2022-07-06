import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function HttpRequestLogRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.resource('http-request-log', 'HttpRequestLogController')
      .apiOnly()
      .only(['index', 'show'])
      .middleware({
        index: ['auth'],
        show: ['auth']
      });
  }).namespace(_nsV1(''));
}
