import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function ResourceRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on

    Route.patch('resources/:id', 'ResourcesController.patch').middleware('auth');
    Route.put('resources/:id', 'ResourcesController.update').middleware('auth');
    Route.resource('resources', 'ResourcesController')
      .apiOnly()
      .except(['update'])
      .middleware({
        '*': ['auth']
      });
  }).namespace(_nsV1(''));
}
