export interface HashComparer {
  compare: (plainText: string, hashedText: string) => Promise<boolean>
}
