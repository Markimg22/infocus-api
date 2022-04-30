import { UpdatePerformanceController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeDbLoadPerformance,
  makeDbUpdatePerformance,
} from '@/main/factories';

export const makeUpdatePerformanceController = (): Controller => {
  const controller = new UpdatePerformanceController(
    makeDbUpdatePerformance(),
    makeDbLoadPerformance()
  );
  return controller;
};
