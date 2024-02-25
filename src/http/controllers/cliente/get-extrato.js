const db = require('../../../repositories/database')

module.exports = async function getExtrato(req, res) {

    const cliente_id = req.params.id
    //const client = await db.pool.connect()
    try {
        if (cliente_id < 1 || cliente_id > 5) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            return
        }
        
        const rultimas_transacoes = await db.query(
            //'select saldo, valor, limite, tipo, descricao, realizada_em from clientes c left join transacoes_' + cliente_id + ' t on t.id_cliente = c.id where c.id = $1 ORDER BY t.id DESC LIMIT 10;',
            'select saldo, valor, limite, tipo, descricao, realizada_em from transacoes_' + cliente_id + ' order by id desc limit 10;'
        )
        const ultimas_transacoes = rultimas_transacoes.rows
        
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
            saldo: {
                total: ultimas_transacoes[0].saldo,
                data_extrato: new Date().toISOString(),
                limite: ultimas_transacoes[0].limite
            },
            ultimas_transacoes: ultimas_transacoes.filter(t => t.exibir).map((row) => {
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
