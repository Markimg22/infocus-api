export interface LoadPerformance {
  loadByUserId: (userId: string) => Promise<LoadPerformance.Result>
}

export namespace LoadPerformance {
  export type Result = {
    totalWorkTime: number,
    totalRestTime: number,
    totalTasksFinished: number
  }
}
