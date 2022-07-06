import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const UserSchema = {
  login: {
    schema: schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string(),
      remember_me_token: schema.boolean()
    }),
    message: {}
  }
};
