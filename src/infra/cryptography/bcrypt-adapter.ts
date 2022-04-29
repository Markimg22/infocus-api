import { HashComparer, Hasher } from '@/data/protocols/cryptography';

import bcrypt from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.salt);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText);
  }
}
