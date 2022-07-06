import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { IDSchema, UUIDSchema } from './GeneralValidator';

const defaultSchema = {
  is_parent: schema.boolean([rules.required()]),
  parent_id: schema.number([rules.requiredWhen('is_parent', '=', false)]),
  code: schema.string({ trim: true }, [
    rules.unique({ table: 'resources', column: 'code' }),
    rules.required(),
    rules.alpha({
      allow: ['underscore', 'dash']
    })
  ]),
  name_id: schema.string({ trim: true }),
  name_en: schema.string({ trim: true }),
  description: schema.string({ trim: true })
  // is_active: schema.boolean([rules.required()])
};

export const resourceSchema = {
  create: {
    schema: schema.create(defaultSchema),
    messages: {}
  },
  update: {
    schema: schema.create({
      body: schema.object().members({
        ...defaultSchema
      }),
      params: schema.object().members(UUIDSchema('resources'))
    }),
    messages: {}
  },
  patch: {
    schema: schema.create({
      body: schema.object().members({
        is_active: schema.boolean([rules.required()])
      }),
      params: schema.object().members(UUIDSchema('resources'))
    }),
    messages: {}
  }
};
