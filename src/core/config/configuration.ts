import { environmentVariables } from "./environment-variables";

export type EnvironmentVariables = {
  AUTH: {
    DATABASE_URL: string;
    DIRECT_URL: string;
  };
  DATABASE: {
    HOST: string;
    NAME: string;
    PASSWORD: string;
    PORT: number;
    USERNAME: string;
  };
  ENCRYPTION_SECRET: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  PORT: number;
  TURSO: {
    AUTH_TOKEN: string;
    DATABASE_URL: string;
    LOCAL_DEV: string;
  };
};

const variables = environmentVariables();
const {
  DATABASE_HOST: HOST = "localhost",
  DATABASE_NAME: NAME = "app_database",
  DATABASE_PASSWORD: PASSWORD = "dbpassword",
  DATABASE_PORT = "5432",
  DATABASE_USERNAME: USERNAME = "dbusername",
  ENCRYPTION_SECRET = "encryptionsecret",
  JWT_SECRET = "jwtsecret",
  NODE_ENV = "development",
  PORT = "3000",
  TURSO_AUTH_TOKEN: AUTH_TOKEN = "here-auth-token",
  TURSO_DATABASE_URL = "here-database-url",
  TURSO_LOCAL_DEV: LOCAL_DEV = "file:./db/truso.db",
  AUTH_DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  AUTH_DIRECT_URL: DIRECT_URL = "direct_url",
} = variables.env;

export const configuration = (): EnvironmentVariables => ({
  AUTH: {
    DATABASE_URL: AUTH_DATABASE_URL,
    DIRECT_URL,
  },
  DATABASE: {
    HOST,
    PORT: Number.parseInt(DATABASE_PORT, 10),
    NAME,
    USERNAME,
    PASSWORD,
  },
  ENCRYPTION_SECRET,
  JWT_SECRET,
  NODE_ENV,
  PORT: Number.parseInt(PORT, 10),
  TURSO: {
    AUTH_TOKEN,
    DATABASE_URL: TURSO_DATABASE_URL,
    LOCAL_DEV,
  },
});

export const { environment } = variables;
