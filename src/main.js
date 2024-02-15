const http = require('node:http')
const startDb = require('./start-db')

startDb()
http.createServer(async (req, res) => {
  try {
    req.raw_body = ''
    req.on('data', (chunk) => {
      req.raw_body += chunk.toString()
    })
    req.on('end', async () => {
      try {
        req.body = JSON.parse(req.raw_body || '{}')
      } catch (e) {
        req.body = null
      }

      await require('./http/kernel')(req, res)
    })
    
    return
  } catch (e) {
    console.log(e)
    if (!res.statusCode) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
    }
    res.end()
  }
}).listen(9999, '0.0.0.0')