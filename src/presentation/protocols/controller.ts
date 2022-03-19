import { HttpResponse } from '@/types'

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
