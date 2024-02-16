const http = require('node:http')
const startDb = require('./start-db')
setTimeout(() => startDb(), 3000)

http.createServer(async (req, res) => {
  try {
    req.raw_body = ''
    req.on('data', (chunk) => {
      req.raw_body += chunk.toString()
    })
    req.on('end', async () => {
      try {
        try {
          req.body = JSON.parse(req.raw_body || '{}')
        } catch (e) {
          req.body = null
        }

        await require('./http/kernel')(req, res)
      } catch (e) {
        console.log('ERRO GERAL', { erro: e })
      } finally {
        console.log({
          statusCode: res.statusCode,
          url: req.url,
          method: req.method,
          body: req.body
        })
      }
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