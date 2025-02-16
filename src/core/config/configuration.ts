export type EnvironmentVariables = {
  NODE_ENV: string;
  PORT: number;
  DATABASE: {
    HOST: string;
    PORT: number;
    NAME: string;
    USERNAME: string;
    PASSWORD: string;
  };
  ENCRYPTION_SECRET: string;
  JWT_SECRET: string;
};

const {
  NODE_ENV = "development",
  PORT = "3000",
  DATABASE_HOST: HOST = "localhost",
  DATABASE_PORT = "5432",
  DATABASE_NAME: NAME = "app_database",
  DATABASE_USERNAME: USERNAME = "dbusername",
  DATABASE_PASSWORD: PASSWORD = "dbpassword",
  ENCRYPTION_SECRET = "encryptionsecret",
  JWT_SECRET = "jwtsecret",
} = process.env;

const configuration = (): EnvironmentVariables => ({
  NODE_ENV,
  PORT: Number.parseInt(PORT, 10),
  DATABASE: {
    HOST,
    PORT: Number.parseInt(DATABASE_PORT, 10),
    NAME,
    USERNAME,
    PASSWORD,
  },
  ENCRYPTION_SECRET,
  JWT_SECRET,
});
export default configuration;
