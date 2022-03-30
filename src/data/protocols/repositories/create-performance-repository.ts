export interface CreatePerformanceRepository {
  create: (data: CreatePerformanceRepository.Params) => Promise<CreatePerformanceRepository.Result>
}

export namespace CreatePerformanceRepository {
  export type Params = {
    userId: string,
  }

  export type Result = void
}
