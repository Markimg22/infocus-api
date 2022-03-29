import { UpdatePerformance } from '@/domain/usecases'

export interface UpdatePerformanceRepository {
  update: (data: UpdatePerformanceRepository.Params) => Promise<UpdatePerformanceRepository.Result>
}

export namespace UpdatePerformanceRepository {
  export type Params = UpdatePerformance.Params
  export type Result = UpdatePerformance.Result
}
