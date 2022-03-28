export interface CreatePerformanceRepository {
  create: (data: CreatePerformanceRepository.Params) => Promise<CreatePerformanceRepository.Result>
}

export namespace CreatePerformanceRepository {
  export type Params = {
    userId: string,
    totalTasksFinished: number,
    totalRestTime: number,
    totalWorkTime: number
  }

  export type Result = void
}
