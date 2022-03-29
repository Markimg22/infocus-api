import { LoadPerformance } from '@/domain/usecases'

export interface UpdatePerformance {
  update: (params: UpdatePerformance.Params) => Promise<UpdatePerformance.Result>
}

export namespace UpdatePerformance {
  export type Params = {
    userId: string,
    field: 'totalWorkTime' | 'totalRestTime' | 'totalTasksFinished',
    value: number
  }

  export type Result = LoadPerformance.Result
}
