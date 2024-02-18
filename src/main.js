const startDb = require('./database/start-db')
const express = require('express')
const app = express()

const getExtrato = require('./http/controllers/cliente/get-extrato')
const postTransacoes = require('./http/controllers/cliente/post-transacoes')

app.get('/clientes/:id/extrato', async (req, res) => {
  getExtrato(req, res)
})

app.post('/clientes/:id/transacoes', express.json(), async (req, res) => {
  postTransacoes(req, res)
})

app.listen(9999, async () => {
  await startDb()
  console.log('Server is running on port 9999')
})