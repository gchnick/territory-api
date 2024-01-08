import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number(),
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number(),
  ENCRYPTION_SECRET: Joi.required(),
  JWT_SECRET: Joi.required(),
});
