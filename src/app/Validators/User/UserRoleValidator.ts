import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { IDSchema } from '../GeneralValidator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

const defaultSchema = {
  user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
  role_id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
  org_id: schema.number([rules.exists({ table: 'organizations', column: 'id' })]),
  is_active: schema.boolean([rules.required()])
};

const getSchema = (ctx: HttpContextContract) => {
  const newSchema = { ...defaultSchema };
  newSchema.role_id = schema.number([
    rules.exists({ table: 'roles', column: 'id' }),
    rules.exists({
      table: 'user_roles',
      column: 'role_id',
      whereNot: {
        user_id: ctx.request.body().resource_id,
        role_id: ctx.request.body().role_id,
        org_id: ctx.request.body().org_id
      }
    })
  ]);
  return newSchema;
};

export const getSchemaStore = (ctx: HttpContextContract) => {
  const newSchema = getSchema(ctx);
  return {
    schema: schema.create(newSchema),
    messages: {}
  };
};

export const getSchemaUpdate = (ctx: HttpContextContract) => {
  const newSchema = getSchema(ctx);
  return {
    schema: schema.create({
      body: schema.object().members({
        ...newSchema
      }),
      params: schema.object().members(IDSchema)
    })
  };
};

export const userRoleSchema = {
  create: {
    schema: schema.create(defaultSchema),
    messages: {}
  },
  update: {
    schema: schema.create({
      body: schema.object().members({
        ...defaultSchema
      }),
      params: schema.object().members(IDSchema)
    }),
    messages: {}
  },
  patch: {
    schema: schema.create({
      body: schema.object().members({
        is_active: defaultSchema.is_active
      }),
      params: schema.object().members(IDSchema)
    }),
    messages: {}
  }
};
