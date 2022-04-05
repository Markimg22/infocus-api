import pino from 'pino'

export const logger = pino({
  enabled: true,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
