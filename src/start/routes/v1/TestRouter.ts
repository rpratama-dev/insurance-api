import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

const middleWare = ['auth', 'acl:fires:earthquake'];
export default function TestRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.resource('test', 'AuthController').apiOnly().middleware({
      index: middleWare,
      show: middleWare,
      update: middleWare,
      destroy: middleWare
    });
  }).namespace(_nsV1(''));
}
