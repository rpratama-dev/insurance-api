import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { IDSchema } from '../GeneralValidator';

const defaultSchema = {
  key: schema.string({ trim: true }, [
    rules.required(),
    rules.unique({ column: 'key', table: 'roles' }),
    rules.alpha({
      allow: ['underscore', 'dash']
    })
  ]),
  name: schema.string({ trim: true }, [rules.required()]),
  description: schema.string({ trim: true }, [rules.required()]),
  is_active: schema.boolean([rules.required()])
};

export const roleSchema = {
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
