const colorsCodes = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  crimson: '\x1b[38m',
  red: '\x1b[31m',
}

export const colorLog = (message, color = 'crimson') =>
  console.info(`${colorsCodes[color]}%s${colorsCodes.reset}`, message)
