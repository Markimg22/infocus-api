import { UpdatePerformanceRepository } from '@/data/protocols/repositories';
import { UpdatePerformance } from '@/domain/usecases';

export class DbUpdatePerformance implements UpdatePerformance {
  constructor(
    private readonly updatePerformanceRepository: UpdatePerformanceRepository
  ) {}

  async update(
    params: UpdatePerformance.Params
  ): Promise<UpdatePerformance.Result> {
    await this.updatePerformanceRepository.update(params);
  }
}
