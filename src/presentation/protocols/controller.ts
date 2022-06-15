import { HttpResponse } from '@/presentation/protocols';

export interface Controller<R = any, B = any> {
  handle: (request: R) => Promise<HttpResponse<B>>;
}
