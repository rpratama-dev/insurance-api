import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function RoleRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.resource('roles', 'RolesController')
      .apiOnly()
      .middleware({
        '*': ['auth']
      });
  }).namespace(_nsV1(''));
}
