import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function UserRoleRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.resource('user-roles', 'UserRolesController').apiOnly();
  })
    .namespace(_nsV1(''))
    .middleware('auth');
}
