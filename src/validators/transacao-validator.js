const CACHE_SALDOS = []

module.exports = async function transacaoValidator(db, cliente_id, valor, tipo) {
    let saldo_cache = CACHE_SALDOS.find(saldo => saldo.cliente_id === cliente_id)
    if (!saldo_cache) {
        saldo_cache = await new Promise(
            (resolve, reject) => db.get(
                'select * from clientes where id = ?',
                [cliente_id],
                (err, row) => (err) ? reject('Cliente não encontrado') : resolve(row)
            )
        )
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