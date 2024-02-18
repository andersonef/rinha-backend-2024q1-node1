const db = require('../../../database/repository')

module.exports = async function getExtrato(req, res) {

    const cliente_id = req.params.id
    //const client = await db.pool.connect()
    try {
        const rultimas_transacoes = await db.query(
            'select saldo, valor, tipo, descricao, realizada_em from clientes c left join transacoes t on t.id_cliente = c.id where c.id = $1 ORDER BY t.id DESC LIMIT 10;',
            [cliente_id]
        )
        if (!rultimas_transacoes.rows.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ erro: 'Cliente não encontrado' }))

            return
        }
        const ultimas_transacoes = rultimas_transacoes.rows
        
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
            saldo: ultimas_transacoes[0].saldo,
            ultimas_transacoes: ultimas_transacoes.filter(t => t.realizada_em != null).map((row) => {
                return {
                    valor: row.valor,
                    tipo: row.tipo,
                    descricao: row.descricao,
                    realizada_em: row.realizada_em
                }
            })
        }))
    } finally {
        //client.release()
    }
}
