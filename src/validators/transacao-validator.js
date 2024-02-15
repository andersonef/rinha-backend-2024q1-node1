const CACHE_SALDOS = []
const db = require('../database/repository')

module.exports = async function transacaoValidator(cliente_id, valor, tipo) {
    let saldo_cache = CACHE_SALDOS.find(saldo => saldo.cliente_id === cliente_id)
    if (!saldo_cache) {
        saldo_cache = await db.query(
            'select * from clientes where id = $1',
            [cliente_id]
        )
        saldo_cache = saldo_cache.rows[0]
        CACHE_SALDOS.push(saldo_cache)
    }

    if (tipo === 'c') {
        saldo_cache.saldo += valor
        return {
            limite: saldo_cache.limite,
            saldo: saldo_cache.saldo
        }
    }
    
    if (Math.abs(saldo_cache.limite + saldo_cache.saldo) < valor) {
        throw 'Saldo insuficiente'
    }
    saldo_cache.saldo -= valor

    return {
        limite: saldo_cache.limite,
        saldo: saldo_cache.saldo
    }
}