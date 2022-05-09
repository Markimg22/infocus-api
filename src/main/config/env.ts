export const env = {
  apiUrl: process.env.API_URL || 'http://localhost:8080',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://admin:admin@localhost:5432/database',
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'ASDg1@eff=13-5FASDA',
  mailFrom: process.env.MAIL_FROM || 'smtp.mailtrap.io',
  mailHost: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  mailPort: process.env.MAIL_PORT || 2525,
  mailPassword: process.env.MAIL_PASSWORD || '660dedd174c71f',
  mailUsername: process.env.MAIL_USERNAME || '0582842759e264',
};
