import { client } from '@/infra/helpers'
import {
  PrismaCheckAccessTokenRepository,
  PrismaCheckUserByEmailRepository,
  PrismaCreateAccessTokenRepository,
  PrismaCreatePerformanceRepository,
  PrismaCreateTaskRepository,
  PrismaCreateUserRepository,
  PrismaDeleteTaskRepository,
  PrismaLoadPerformanceRepository,
  PrismaLoadTasksRepository,
  PrismaLoadUserByEmailRepository,
  PrismaUpdateAccessTokenRepository,
  PrismaUpdatePerformanceRepository,
  PrismaUpdateStatusTaskRepository
} from '@/infra/repositories'

type RepositoriesType = {
  checkAccessTokenRepository: PrismaCheckAccessTokenRepository,
  checkUserByEmailRepository: PrismaCheckUserByEmailRepository,
  updateStatusTaskRepository: PrismaUpdateStatusTaskRepository,
  updatePerformanceRepository: PrismaUpdatePerformanceRepository,
  updateAccessTokenRepository : PrismaUpdateAccessTokenRepository,
  loadUserByEmailRepository: PrismaLoadUserByEmailRepository,
  loadTasksRepository: PrismaLoadTasksRepository,
  loadPerformanceRepository: PrismaLoadPerformanceRepository,
  deleteTaskRepository: PrismaDeleteTaskRepository,
  createUserRepository: PrismaCreateUserRepository,
  createTaskRespository: PrismaCreateTaskRepository,
  createPerformanceRepository: PrismaCreatePerformanceRepository,
  createAccessTokenRepository: PrismaCreateAccessTokenRepository
}

export const makeRepositories = (): RepositoriesType => {
  return {
    checkAccessTokenRepository: new PrismaCheckAccessTokenRepository(client),
    checkUserByEmailRepository: new PrismaCheckUserByEmailRepository(client),
    updateStatusTaskRepository: new PrismaUpdateStatusTaskRepository(client),
    updatePerformanceRepository: new PrismaUpdatePerformanceRepository(client),
    updateAccessTokenRepository: new PrismaUpdateAccessTokenRepository(client),
    loadUserByEmailRepository: new PrismaLoadUserByEmailRepository(client),
    loadTasksRepository: new PrismaLoadTasksRepository(client),
    loadPerformanceRepository: new PrismaLoadPerformanceRepository(client),
    deleteTaskRepository: new PrismaDeleteTaskRepository(client),
    createUserRepository: new PrismaCreateUserRepository(client),
    createTaskRespository: new PrismaCreateTaskRepository(client),
    createPerformanceRepository: new PrismaCreatePerformanceRepository(client),
    createAccessTokenRepository: new PrismaCreateAccessTokenRepository(client)
  }
}
