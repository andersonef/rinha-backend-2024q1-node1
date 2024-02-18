const validar_transacao = require('../../../validators/transacao-validator')
const db = require('../../../database/repository')
const Redis = require('ioredis')

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379

})

module.exports = async function postTransacoes(req, res) {
    const cliente_id = req.params.id
    const { valor, tipo, descricao } = req.body
    let client = null
    console.log('valor', valor, tipo, descricao)

    try {
        const { limite, saldo } = await validar_transacao(cliente_id, parseInt(valor), tipo)

        client = await db.pool.connect()
        await client.query(
            'INSERT INTO transacoes (id_cliente, valor, tipo, descricao) VALUES ($1, $2, $3, $4);',
            [
                cliente_id,
                valor,
                tipo,
                descricao
            ]
        )
        client.release()

        let saldo_cache = await redis.get(`saldo:${cliente_id}`)
        saldo_cache = JSON.parse(saldo_cache)
        saldo_cache.saldo = saldo
        await redis.set(`saldo:${cliente_id}`, JSON.stringify(saldo_cache))

        res.end(JSON.stringify({
            limite,
            saldo
        }))
    } catch (err) {
        console.log(err)
        res.writeHead(422, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: 'Saldo insuficiente' }))
    }
}
