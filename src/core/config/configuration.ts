export interface EnviromentVariables {
  NODE_ENV: string;
  PORT: number;
  SQLITE_DATABASE: string;
  DATABASE: {
    HOST: string;
    PORT: number;
    NAME: string;
    USERNAME: string;
    PASSWORD: string;
  };
  ENCRYPTION_SECRET: string;
  JWT_SECRET: string;
}

const configuration = (): EnviromentVariables => ({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number.parseInt(process.env.PORT as string, 10) || 3000,
  SQLITE_DATABASE: process.env.SQLITE_DATABASE || "db/sql",
  DATABASE: {
    HOST: process.env.DATABASE_HOST || "localhost",
    PORT: Number.parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
    NAME: process.env.DATABASE_NAME || "db/sql",
    USERNAME: process.env.DATABASE_USERNAME || "dbusername",
    PASSWORD: process.env.DATABASE_PASSWORD || "dbpassword",
  },
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || "encryptionsecret",
  JWT_SECRET: process.env.JWT_SECRET || "jwtsecret",
});
export default configuration;
