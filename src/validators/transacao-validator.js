const CACHE_SALDOS = []
const db = require('../database/repository')
const Redis = require('ioredis')

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379

})
module.exports = async function transacaoValidator(cliente_id, valor, tipo) {
    let saldo_cache = await redis.get(`saldo:${cliente_id}`)
    saldo_cache = JSON.parse(saldo_cache)

    if (!saldo_cache) {
        saldo_cache = await db.query(
            'select * from clientes where id = $1',
            [cliente_id]
        )
        saldo_cache = saldo_cache.rows[0]
        await redis.set(`saldo:${cliente_id}`, JSON.stringify(saldo_cache))
    }

    if (tipo === 'c') {
        saldo_cache.saldo += valor
        return {
            limite: saldo_cache.limite,
            saldo: saldo_cache.saldo
        }
    }
    
    console.log({
        limite: saldo_cache.limite,
        saldo: saldo_cache.saldo,
        valor
    })
    if (valor - saldo_cache.saldo > saldo_cache.limite) {
        throw 'Saldo insuficiente'
    }

    return {
        limite: saldo_cache.limite,
        saldo: saldo_cache.saldo
    }
}