/* eslint-disable no-extra-boolean-cast */
/* eslint-disable prettier/prettier */
import pino from 'pino'

export const logger = pino({
  enabled: !(!!process.env.LOG_DISABLED),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})
