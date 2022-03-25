import { CreateTaskRespository } from '@/data/protocols/repositories'

export class CreateTaskRespositorySpy implements CreateTaskRespository {
  params = {}

  async create(data: CreateTaskRespository.Params): Promise<CreateTaskRespository.Result> {
    this.params = data
  }
}
