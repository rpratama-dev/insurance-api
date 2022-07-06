import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function AuthRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.resource('auth', 'AuthController')
      .apiOnly()
      .only(['index', 'store', 'destroy'])
      .middleware({
        index: ['auth'],
        destroy: ['auth']
      });
  }).namespace(_nsV1(''));
}
