import { LoadPerformance } from '@/domain/usecases'

export interface LoadPerformanceRepository {
  load: (userId: string) => Promise<LoadPerformanceRepository.Result>
}

export namespace LoadPerformanceRepository {
  export type Result = LoadPerformance.Result
}
