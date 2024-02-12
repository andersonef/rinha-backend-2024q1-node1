const http = require('node:http')
const startDb = require('./start-db')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db.sqlite3', async (err) => err ? console.log(err) : await startDb(db))

http.createServer(async (req, res) => {
  try {
    req.raw_body = ''
    req.on('data', (chunk) => {
      req.raw_body += chunk.toString()
    })
    req.on('end', async () => {
      req.body = JSON.parse(req.raw_body || '{}')

      await require('./http/kernel')(req, res, db)
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