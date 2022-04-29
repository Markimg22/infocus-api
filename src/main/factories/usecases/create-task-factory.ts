import { DbCreateTask } from '@/data/usecases';
import { CreateTask } from '@/domain/usecases';
import { makeRepositories } from '@/main/factories';

export const makeDbCreateTask = (): CreateTask => {
  const { createTaskRespository } = makeRepositories();
  return new DbCreateTask(createTaskRespository);
};
