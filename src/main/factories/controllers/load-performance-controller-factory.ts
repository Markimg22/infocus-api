import { LoadPerformanceController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbLoadPerformance } from '@/main/factories';

export const makeLoadPerformanceController = (): Controller => {
  const controller = new LoadPerformanceController(makeDbLoadPerformance());
  return controller;
};
