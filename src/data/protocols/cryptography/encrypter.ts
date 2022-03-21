export interface Encrypter {
  encrypt: (plainText: string) => Promise<string>
}
