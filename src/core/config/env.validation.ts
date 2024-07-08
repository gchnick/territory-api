import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number(),
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number(),
  DATABASE_NAME: Joi.string(),
  DATABASE_USERNAME: Joi.string(),
  DATABASE_PASSWORD: Joi.string(),
  ENCRYPTION_SECRET: Joi.required(),
  JW_TOKEN_SECRET: Joi.required(),
});
