export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number.parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    type: process.env.DATABASE_TYPE || "sqlite",
    host: process.env.DATABASE_HOST || "localhost",
    port: Number.parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
    name: process.env.DATABASE_NAME || "db/sql",
    username: process.env.DATABASE_USERNAME || "dbusername",
    password: process.env.DATABASE_PASSWORD || "dbpassword",
  },
  encryptionSecret: process.env.ENCRYPTION_SECRET,
  jwtSecret: process.env.JWT_SECRET,
});
