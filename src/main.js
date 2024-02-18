const startDb = require('./start-db')
setTimeout(() => startDb(), 3000)

const express = require('express')
const app = express()

app.get('/clientes/:id/extrato', async (req, res) => {
  require('./http/controllers/cliente/get-extrato')(req, res)
})

app.post('/clientes/:id/transacoes', express.json(), async (req, res) => {
  require('./http/controllers/cliente/post-transacoes')(req, res)
})

app.listen(9999, () => {
  console.log('Server is running on port 9999')
})