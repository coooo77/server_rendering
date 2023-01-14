const fs = require('fs');
const { promises: fsPromise } = fs
const path = require('path');

/**
 * @param {string} msg 
 * @param {'eventLog.txt' | 'reqLog.txt'} file 
 */
const logEvents = async (msg, file = 'eventLog.txt') => {
  const content = `${new Date().toJSON()}\t${msg}\r`

  const logPath = path.join(__dirname, '..', 'logs', file)
  const { dir } = path.parse(logPath)

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  try {
    await fsPromise.appendFile(logPath, content)
  } catch (error) {
    console.error('logEvents ERROR:', error.message)
  }
}

module.exports = {
  logEvents,

  logger(req, res, next) {
    logEvents(`Method: ${req.method}\tOrigin: ${req.headers.origin}\tUrl: ${req.url}`, 'reqLog.txt')
    next()
  }
}