import { RouterContract } from '@ioc:Adonis/Core/Route';
import Path from 'path';

export const NS_PREFIX_V1: string = 'App/Controllers/Http/v1';

export function _nsV1(path?: string): string {
  return Path.join(NS_PREFIX_V1, path || '');
}

import AuthRouter from 'Start/routes/v1/AuthRouter';
import OrganizationRouter from 'Start/routes/v1/OrganizationRouter';
import PermissionRouter from 'Start/routes/v1/PermissionRouter';
import ResourceRouter from 'Start/routes/v1/ResourceRouter';
import RoleRouter from 'Start/routes/v1/RoleRouter';
import TestRouter from 'Start/routes/v1/TestRouter';
import UserRoleRouter from 'Start/routes/v1/UserRoleRouter';
import UserRouter from 'Start/routes/v1/UserRouter';
import HttpRequestLogRouter from 'Start/routes/v1/HttpRequestLogRouter';

export default function index(Route: RouterContract) {
  Route.group(() => {
    AuthRouter(Route);
    UserRouter(Route);
    RoleRouter(Route);
    ResourceRouter(Route);
    PermissionRouter(Route);
    UserRoleRouter(Route);
    TestRouter(Route);
    OrganizationRouter(Route);
    HttpRequestLogRouter(Route);
  })
    .prefix('/v1')
    .namespace(NS_PREFIX_V1);
}
