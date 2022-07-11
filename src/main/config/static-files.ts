import express, { Express } from 'express';
import { resolve } from 'path';

export const setupStaticFiles = (app: Express): void => {
  app.use('/static', express.static(resolve(__dirname, '../../static')));
};
