import { schema, rules } from '@ioc:Adonis/Core/Validator';

export const DefaultIndexValidator = {
  page: schema.number.optional(),
  perPage: schema.number.optional(),
  keyword: schema.string.optional(),
  orderBy: schema.string.optional(),
  sortBy: schema.enum.optional(['asc', 'desc'] as const),
  isActive: schema.enum.optional(['true', 'false'] as const),
  isPagination: schema.enum.optional(['true', 'false'] as const)
};

export const IDSchema = {
  id: schema.string([rules.uuid()])
};

export const UUIDSchema = (table: string) => ({
  id: schema.string([rules.uuid(), rules.exists({ table, column: 'uuid' })])
});

export const GeneralValidator = {
  index: {
    schema: schema.create(DefaultIndexValidator),
    messages: {}
  },
  params: {
    schema: schema.create(IDSchema),
    messages: {}
  }
};
