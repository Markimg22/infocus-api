import { HttpResponse } from '@/presentation/protocols';
import { ServerError, UnauthrorizedError } from '@/presentation/errors';
import { logger } from '@/utils/log';

export const badRequest = (error: Error): HttpResponse => {
  logger.error(`badRequest: {
    statusCode: 400,
    body: ${error.stack}
  }`);
  return {
    statusCode: 400,
    body: error,
  };
};

export const forbidden = (error: Error): HttpResponse => {
  logger.error(`forbidden: {
    statusCode: 403,
    body: ${error.stack}
  }`);
  return {
    statusCode: 403,
    body: error,
  };
};

export const ok = (data: any): HttpResponse => {
  logger.info(`ok: {
    statusCode: 200,
    body: ${JSON.stringify(data)}
  }`);
  return {
    statusCode: 200,
    body: data,
  };
};

export const serverError = (error: Error): HttpResponse => {
  logger.error(`serverError: {
    statusCode: 500,
    body: ${error.stack}
  }`);
  return {
    statusCode: 500,
    body: new ServerError(error.stack as string),
  };
};

export const unauthorized = (): HttpResponse => {
  logger.error(`unauthorized: {
    statusCode: 401,
    body: ${new UnauthrorizedError()}
  }`);
  return {
    statusCode: 401,
    body: new UnauthrorizedError(),
  };
};
