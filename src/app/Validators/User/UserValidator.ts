import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { IDSchema } from '../GeneralValidator';

const passwordSchema = {
  password: schema.string([
    rules.required(),
    rules.confirmed(),
    rules.minLength(8),
    rules.maxLength(40),
    rules.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/)
  ])
};

const defaultSchema = {
  name: schema.string({ trim: true }, [rules.required()]),
  email: schema.string({ trim: true }, [
    rules.required(),
    rules.email(),
    rules.unique({ column: 'email', table: 'users' })
  ]),
  phone_number: schema.string([
    rules.required(),
    rules.regex(/^628[1-9][0-9]\d{7,10}$/),
    rules.unique({ column: 'phone_number', table: 'users' })
  ]),
  is_active: schema.boolean.optional()
};

const defaultMessages = {
  '*': (field: string, rule: string) => {
    return `${rule} validation error on ${field}`;
  },
  'required': 'The {{ field }} is required to create a new account',
  'phone_number.regex': 'phone_number format not match, try with 628xxx',
  'password.regex': 'Password must be containins uppercase, lowercase letters and numbers',
  'password.minimumLength': 'Minimung length of password is 8 characters',
  'password.maxLength': 'Maximum length of password is 40 characters'
};

export const userSchema = {
  create: {
    schema: schema.create({ ...defaultSchema, ...passwordSchema }),
    messages: defaultMessages
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
