import { userSchema } from 'App/Validators/User/UserValidator';
import CustomController from 'Traits/CustomController';

export default class UsersController extends CustomController {
  constructor() {
    const allows1 = ['id', 'uuid', 'name', 'email', 'phone_number'];
    const allows2 = ['is_verified', 'last_login', 'is_active', 'created_at'];
    super({
      table: {
        tableName: 'users',
        selectedField: [...allows1, ...allows2],
        searchField: [...allows1]
      },
      schema: {
        create: userSchema.create,
        update: userSchema.update,
        patch: userSchema.patch
      }
    });
  }
}
