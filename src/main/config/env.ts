import dotenv from 'dotenv';

dotenv.config();

export const env = {
  apiUrl: process.env.API_URL || 'http://localhost:8080',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://admin:admin@localhost:5432/database',
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'ASDg1@eff=13-5FASDA',
  mailFrom: process.env.MAIL_FROM || 'from@example.com',
  mailHost: process.env.MAIL_HOST || '',
  mailPort: Number(process.env.MAIL_PORT) || 2525,
  mailUsername: process.env.MAIL_USERNAME || '',
  mailPassword: process.env.MAIL_PASSWORD || '',
};
