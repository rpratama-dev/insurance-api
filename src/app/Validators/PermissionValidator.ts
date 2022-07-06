import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { IDSchema } from './GeneralValidator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

const defaultSchema = {
  role_id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
  resource_id: schema.number([rules.exists({ table: 'resources', column: 'id' })]),
  permission: schema.object().members({
    create: schema.boolean(),
    read: schema.boolean(),
    update: schema.boolean(),
    delete: schema.boolean()
  }),
  is_active: schema.boolean([rules.required()])
};

const getSchema = (ctx: HttpContextContract) => {
  const newSchema = { ...defaultSchema };
  newSchema.resource_id = schema.number([
    rules.exists({ table: 'resources', column: 'id' }),
    rules.exists({
      table: 'permissions',
      column: 'resource_id',
      whereNot: {
        role_id: ctx.request.body().role_id,
        resource_id: ctx.request.body().resource_id
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

export const permissionSchema = {
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
