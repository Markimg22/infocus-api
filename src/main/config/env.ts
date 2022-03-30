export const env = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5432/database',
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'ASDg1@eff=13-5FASDA'
}
