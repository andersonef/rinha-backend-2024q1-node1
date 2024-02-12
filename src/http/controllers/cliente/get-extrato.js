module.exports = async function getExtrato(req, res, db) {
    const { cliente_id } = req
    const saldo = await new Promise(
        (resolve, reject) => db.get(
            'select * from clientes where id = ?',
            [cliente_id],
            (err, row) => (err) ? reject(err) : resolve(row)
        )
    )

    if (!saldo) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: 'Cliente não encontrado' }))

        return
    }

    const ultimas_transacoes = await new Promise((resolve, reject) => db.all(
        'select * from transacoes where id_cliente = ? ORDER BY id DESC LIMIT 10;',
        [cliente_id],
        (err, rows) => (err) ? reject(err) : resolve(rows)
    ))
    
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
        saldo,
        ultimas_transacoes
    }))
}
