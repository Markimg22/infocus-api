import { HttpResponse } from '@/presentation/protocols'
import { ServerError, UnauthrorizedError } from '@/presentation/errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string)
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthrorizedError()
})
