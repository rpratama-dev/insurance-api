import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';
import { UserSchema } from 'App/Validators/User/AuthValidator';
import { DateTime } from 'luxon';
import ErrorHandler from 'App/Exceptions/ErrorHandler';
import CustomController from 'Traits/CustomController';
import { GeneralValidator } from 'App/Validators/GeneralValidator';

type TPermission = 'get' | 'post' | 'put' | 'patch' | 'delete';
type TResource = {
  resource: string;
  permision: Array<TPermission>;
};
type TUserRole = {
  role: string;
  acl: Array<TResource>;
};

type TUserRoles = Array<TUserRole>;
const filedSelect = [
  'id',
  'uuid',
  'name',
  'email',
  'phone_number',
  'remember_me_token',
  'is_verified',
  'last_login',
  'is_active'
];
export default class AuthController extends CustomController {
  constructor() {
    super({
      table: {
        tableName: 'users',
        selectedField: filedSelect,
        searchField: filedSelect
      },
      schema: {
        // TODO: Update this validator if routes contain create, update, patch
        // Curently route create, update, patch not provide for this controller
        create: GeneralValidator.params,
        update: GeneralValidator.params,
        patch: GeneralValidator.params
      }
    });
  }

  public async index(ctx: HttpContextContract): Promise<any> {
    const { request: req, response: res, auth } = ctx;
    const uuid = auth.user?.uuid;
    const resource = req.input('resource');

    const user = await User.query()
      .select(filedSelect)
      .where({ uuid: uuid })
      .preload('roles', (role) => {
        role
          .preload('organizations')
          .preload('resources', (rs) => {
            rs.preload('permissions');
          })
          .if(resource, (rs) => {
            rs.whereHas('resources', (q) => {
              q.where('child', '=', resource);
            });
          });
      })
      .first();
    if (!user) throw new ErrorHandler(404, 'User Not Found');
    if (!user.is_active || user.deleted_at)
      throw new ErrorHandler(403, "Access denied!!. You'r not permitted to access this system");

    const roles: TUserRoles = user.roles.map((rl) => {
      const temp: TUserRole = {
        role: rl.key,
        acl: rl.resources.map((rs) => {
          const tempRs: TResource = {
            resource: rs.code,
            permision: []
          };
          for (const [key, val] of Object.entries(rs.permissions[0].permission)) {
            if (val) tempRs.permision.push(key as TPermission);
          }
          return tempRs;
        })
      };
      return temp;
    });

    const allResource: Record<string, any> = {
      role: [],
      resource: {}
    };
    roles.forEach((el) => {
      allResource.role.push(el.role);
      el.acl.forEach((ek) => {
        if (!allResource.resource[ek.resource]) allResource.resource[ek.resource] = {};
        ek.permision.map((em) => {
          allResource.resource[ek.resource][em] = true;
        });
      });
    });
    return this.responseSuccess(res, { data: { allResource, roles, user } });
  }

  public async store({ request, response: res, auth }: HttpContextContract) {
    const payload = await request.validate(UserSchema.login);
    const { email, password, remember_me_token: rememberMe } = payload;

    const user = await User.query().where({ is_active: true, email: email }).first();
    if (!user) throw new ErrorHandler(401, 'Wrong Email / Password');

    const isMatch = await Hash.verify(user.password, password);
    if (!isMatch) throw new ErrorHandler(401, 'Wrong Email / Password');

    user.last_login = DateTime.now();
    user.remember_me_token = rememberMe ? '1' : '0';
    const realIp = request.headers()['x-forwarded-for'] || request.ip();

    const token = await auth.use('api').login(user, {
      expiresIn: rememberMe ? '1years' : '30days',
      ip_address: realIp,
      user_agent: request.headers()['user-agent']
    });

    const response = {
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        last_login: user.last_login,
        phone_number: user.phone_number,
        remember_me_token: user.remember_me_token
      },
      auth: token.toJSON()
    };

    await user.save();
    return this.responseSuccess(res, { data: response });
  }

  public async destroy({ request: req, ...other }: HttpContextContract): Promise<any> {
    const payload = await req.validate({
      ...GeneralValidator.params,
      data: { id: req.params().id }
    });
    const uuid = payload.id;
    const [user] = await this.findBy({ uuid: uuid });
    if (!user) throw new ErrorHandler(404, 'User Not Found');
    if (user.uuid !== other.auth.user?.uuid) throw new ErrorHandler(403, 'Access Forbidden');

    await other.auth.logout();
    return this.responseSuccess(other.response, {
      message: 'Logout success',
      data: {}
    });
  }
}
