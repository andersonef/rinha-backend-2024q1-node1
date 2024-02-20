const db = require('../repositories/database')
const repository = require('../repositories/redis')

module.exports = async function transacaoValidator(cliente_id, valor, tipo) {
    let saldo_cache = await repository.redis.get(`saldo:${cliente_id}`)
    saldo_cache = JSON.parse(saldo_cache)

    if (!saldo_cache) {
        saldo_cache = await db.query(
            'select * from clientes where id = $1',
            [cliente_id]
        )
        saldo_cache = saldo_cache.rows[0]
    }

    try {
        if (tipo === 'c') {
            saldo_cache.saldo += valor
            return {
                limite: saldo_cache.limite,
                saldo: saldo_cache.saldo
            }
        }
        
        if (valor - saldo_cache.saldo > saldo_cache.limite) {
            throw 'Saldo insuficiente'
        }
        saldo_cache.saldo -= valor

        return {
            limite: saldo_cache.limite,
            saldo: saldo_cache.saldo
        }
    } finally {
        await repository.redis.set(`saldo:${cliente_id}`, JSON.stringify(saldo_cache))
    }
}