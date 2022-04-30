export interface Decrypter {
  decrypt: (cipherText: string) => Promise<string | null>;
}
