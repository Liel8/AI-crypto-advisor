import fs from 'fs'

export const logger = {
  debug(...args) {
    if (process.env.NODE_ENV === 'production') return
    _doLog('DEBUG', ...args)
  },
  info(...args) {
    _doLog('INFO', ...args)
  },
  warn(...args) {
    _doLog('WARN', ...args)
  },
  error(...args) {
    _doLog('ERROR', ...args)
  }
}

function _doLog(level, ...args) {
  const strs = args.map(arg => {
    if (arg instanceof Error) return arg.stack || arg.message
    return typeof arg === 'string' ? arg : JSON.stringify(arg)
  })
  let line = `${_getTime()} - ${level} - ${strs.join(' | ')}\n`
  console.log(line)
  
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
  }
  fs.appendFile('./logs/backend.log', line, () => {})
}

function _getTime() {
  return new Date().toISOString()
}
