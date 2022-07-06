import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function OrganizationRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.patch('/organizations/:id', 'OrganizationsController.patch');
    Route.put('/organizations/:id', 'OrganizationsController.update');
    Route.resource('organizations', 'OrganizationsController').apiOnly().except(['update']);
  })
    .namespace(_nsV1(''))
    .middleware('auth');
}
