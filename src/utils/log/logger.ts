import pino from 'pino'

export const logger = pino({
  // eslint-disable-next-line no-extra-boolean-cast
  enabled: !(!!process.env.LOG_DISABLED),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
