class SignUpController {
  async handle(): Promise<any> {
    return {
      statusCode: 400
    }
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if Validation returns false', async () => {
    const sut = new SignUpController()
    const httpResponse = await sut.handle()
    expect(httpResponse.statusCode).toBe(400)
  })
})
