import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { IDSchema } from './GeneralValidator';

const defaultSchema = {
  name: schema.string({ trim: true }, [rules.required(), rules.maxLength(50)]),
  code: schema.string({ trim: true }, [
    rules.maxLength(5),
    rules.alpha(),
    rules.unique({ column: 'code', table: 'organizations' })
  ]),
  address: schema.string({ trim: true }, [rules.maxLength(255), rules.required()]),
  phone_number: schema.number(),
  email: schema.string({ trim: true }, [rules.maxLength(80), rules.email(), rules.required()]),
  latitude: schema.number([rules.required()]),
  logtitude: schema.number([rules.required()]),
  is_active: schema.boolean([rules.required()])
};

export const organizationSchema = {
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
