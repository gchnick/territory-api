export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number.parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  encryptionSecret: process.env.ENCRYPTION_SECRET,
  jwtSecret: process.env.JWT_SECRET,
});
