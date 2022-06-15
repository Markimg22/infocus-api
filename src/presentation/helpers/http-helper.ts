import { HttpResponse, HttpStatusCode } from '@/presentation/protocols';
import {
  ServerError,
  UnauthrorizedError,
  NotFoundError,
} from '@/presentation/errors';
import { logger } from '@/utils/log';

export const badRequest = (error: Error): HttpResponse => {
  logger.error(`badRequest: {
    statusCode: ${HttpStatusCode.BAD_REQUEST},
    body: ${error.stack}
  }`);
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: error,
  };
};

export const forbidden = (error: Error): HttpResponse => {
  logger.error(`forbidden: {
    statusCode: ${HttpStatusCode.FORBIDDEN},
    body: ${error.stack}
  }`);
  return {
    statusCode: HttpStatusCode.FORBIDDEN,
    body: error,
  };
};

export const ok = (data: any): HttpResponse => {
  logger.info(`ok: {
    statusCode: ${HttpStatusCode.OK},
    body: ${JSON.stringify(data)}
  }`);
  return {
    statusCode: HttpStatusCode.OK,
    body: data,
  };
};

export const serverError = (error: Error): HttpResponse => {
  logger.error(`serverError: {
    statusCode: ${HttpStatusCode.SERVER_ERROR},
    body: ${error.stack}
  }`);
  return {
    statusCode: HttpStatusCode.SERVER_ERROR,
    body: new ServerError(error.stack as string),
  };
};

export const unauthorized = (): HttpResponse => {
  logger.error(`unauthorized: {
    statusCode: ${HttpStatusCode.UNAUTHORIZED},
    body: ${new UnauthrorizedError()}
  }`);
  return {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    body: new UnauthrorizedError(),
  };
};

export const notFound = (): HttpResponse => {
  logger.error(`notFound: {
    statusCode: ${HttpStatusCode.NOT_FOUND},
    body: ${new NotFoundError()}
  }`);
  return {
    statusCode: HttpStatusCode.NOT_FOUND,
    body: new NotFoundError(),
  };
};
