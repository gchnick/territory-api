export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  encryptionSecret: process.env.ENCRYPTION_SECRET,
  jwtSecret: process.env.JWT_SECRET,
});
