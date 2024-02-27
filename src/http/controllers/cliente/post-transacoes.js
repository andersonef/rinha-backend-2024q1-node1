const db = require('../../../repositories/database')
const redis = require('../../../repositories/redis')

module.exports = async function postTransacoes(req, res) {
    const cliente_id = req.params.id

    if (cliente_id < 1 || cliente_id > 5) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return
    }


    const { valor, tipo, descricao } = req.body

    try {
        if (!tipo || !/^[cd]$/.test(tipo)) {
            throw 'Tipo inválido'
        }
        if (!valor || !/^\d+$/.test(valor) || valor < 0) {
            throw 'Valor inválido'
        }
        if (!descricao || descricao.length > 10) {
            throw 'Descrição inválida'
        }
        const is_debito = tipo == 'd'
        if (is_debito) {
            const [ saldo_cache, limite_cache ] = await redis.redis.mget(
                `saldo:${cliente_id}`,
                `limite:${cliente_id}`
            )
            if (saldo_cache - valor < -limite_cache) {
                throw 'Saldo insuficiente'
            }
        }
        
        const result = await db.query(
            'select * from fn_add_transacao($1, $2, $3, $4);',
            [
                cliente_id,
                valor,
                tipo,
                descricao
            ]
        )
        const { status, limite, saldo } = result.rows[0]

        if (status == 'error') {
            throw 'Saldo insuficiente'
        }
        redis.redis.set(`saldo:${cliente_id}`, saldo)

        res.end(JSON.stringify({
            limite,
            saldo
        }))
    } catch (err) {
        console.log('Erro ao salvar transacao', {
            err,
            body: req.body
        })
        res.writeHead(422, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: err }))
    }
}
