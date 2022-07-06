import { roleSchema } from 'App/Validators/User/RoleValidator';
import CustomController from 'Traits/CustomController';

export default class RolesController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'resources',
        selectedField: ['*'],
        searchField: ['code', 'name_id', 'name_en', 'description']
      },
      schema: {
        create: roleSchema.create,
        update: roleSchema.update,
        patch: roleSchema.patch
      }
    });
  }
}
