import { CreateTaskController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeDbCreateTask,
  makeDbLoadTasks,
  makeCreateTaskValidation,
} from '@/main/factories';

export const makeCreateTaskController = (): Controller => {
  const controller = new CreateTaskController(
    makeCreateTaskValidation(),
    makeDbCreateTask(),
    makeDbLoadTasks()
  );
  return controller;
};
