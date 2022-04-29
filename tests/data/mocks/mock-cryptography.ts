import {
  Hasher,
  HashComparer,
  Encrypter,
  Decrypter,
} from '@/data/protocols/cryptography';

import faker from '@faker-js/faker';

export class HasherSpy implements Hasher {
  plainText = '';
  hashedText = faker.datatype.uuid();

  async hash(plainText: string): Promise<string> {
    this.plainText = plainText;
    return this.hashedText;
  }
}

export class HashComparerSpy implements HashComparer {
  plainText = '';
  hashedText = '';
  result = true;

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    this.plainText = plainText;
    this.hashedText = hashedText;
    return this.result;
  }
}

export class EncrypterSpy implements Encrypter {
  plainText = '';
  result = faker.datatype.uuid();

  async encrypt(plainText: string): Promise<string> {
    this.plainText = plainText;
    return this.result;
  }
}

export class DecrypterSpy implements Decrypter {
  cipherText = '';
  plainText: string | null = faker.internet.password();

  async decrypt(cipherText: string): Promise<string | null> {
    this.cipherText = cipherText;
    return this.plainText;
  }
}
