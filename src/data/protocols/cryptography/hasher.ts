export interface Hasher {
  hash: (plainText: string) => Promise<string>
}
