import { RouterContract } from '@ioc:Adonis/Core/Route';
import { _nsV1 } from 'Start/routes/index';

export default function UserRouter(Route: RouterContract) {
  Route.group(() => {
    // Named as auth.index, auth.store and so on
    Route.patch('users/:id', 'UsersController.patch').middleware('auth');
    Route.put('users/:id', 'UsersController.update').middleware('auth');
    Route.resource('users', 'UsersController').apiOnly().except(['update']);
  }).namespace(_nsV1(''));
}
