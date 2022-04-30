import { LoadUserByTokenRepository } from '@/data/protocols/repositories';

import { PrismaClient } from '@prisma/client';

export class PrismaLoadUserByTokenRepository
  implements LoadUserByTokenRepository
{
  constructor(private readonly client: PrismaClient) {}

  async load(
    data: LoadUserByTokenRepository.Params
  ): Promise<LoadUserByTokenRepository.Result | null> {
    const accessToken = await this.client.accessToken.findUnique({
      where: {
        token: data.accessToken,
      },
    });
    if (accessToken) {
      return {
        id: accessToken.userId,
      };
    }
    return null;
  }
}
