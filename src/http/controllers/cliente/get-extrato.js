const db = require('../../../database/repository')

module.exports = async function getExtrato(req, res) {
    const { cliente_id } = req
    const rsaldo = await db.query(
        'select * from clientes where id = $1',
        [cliente_id]
    )
    const saldo = rsaldo.rows[0]
    if (!saldo) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: 'Cliente não encontrado' }))

        return
    }

    const rultimas_transacoes = await db.query(
        'select * from transacoes where id_cliente = $1 ORDER BY id DESC LIMIT 10;',
        [cliente_id]
    )
    const ultimas_transacoes = rultimas_transacoes.rows
    
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
        saldo,
        ultimas_transacoes
    }))
}
