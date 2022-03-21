import {
  Hasher,
  HashComparer,
  Encrypter
} from '@/data/protocols/cryptography'

import faker from '@faker-js/faker'

export class HasherSpy implements Hasher {
  plainText = ''
  hashedText = faker.datatype.uuid()

  async hash(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.hashedText
  }
}

export class HashComparerSpy implements HashComparer {
  plainText = ''
  hashedText = ''
  result = true

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    this.plainText = plainText
    this.hashedText = hashedText
    return this.result
  }
}

export class EncrypterSpy implements Encrypter {
  plainText = ''
  result = faker.datatype.uuid()

  async encrypt(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.result
  }
}
