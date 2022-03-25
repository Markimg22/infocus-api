import { CreateTaskRespository } from '@/data/protocols/repositories'

export class CreateTaskRespositorySpy implements CreateTaskRespository {
  params = {}

  async create(params: CreateTaskRespository.Params): Promise<CreateTaskRespository.Result> {
    this.params = params
  }
}
