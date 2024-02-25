const db = require('../../../repositories/database')
//const crypto = require('crypto')
//const valida_transacao = require('../../../validators/transacao-validator')
//const redis_repository = require('../../../repositories/redis')

module.exports = async function postTransacoes(req, res) {
    const cliente_id = req.params.id

    if (cliente_id < 1 || cliente_id > 5) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return
    }


    const { valor, tipo, descricao } = req.body
    console.log('dados pra post transação >>> ', valor, tipo, descricao)

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

        /*
        const {limite, saldo} = await valida_transacao(cliente_id, valor, tipo)
        const stransacoes = await redis_repository.redis.get(`transacoes:${cliente_id}`)
        const transacoes = JSON.parse(stransacoes) || []

        transacoes.splice(10)
        transacoes
        .unshift({
            valor,
            tipo,
            descricao,
            cliente_id,
            uid: crypto.randomUUID().toString()
        })

        await redis_repository.redis.set(`transacoes:${cliente_id}`, JSON.stringify(transacoes))
        console.log(`vou publicar no redis`)
        redis_repository.redis.publish('nova-transacao', JSON.stringify(transacoes[0]))
        console.log(`publiquei no redis`)
        */
        
        const result = await db.query(
            'select * from fn_add_transacao($1, $2, $3, $4);',
            [
                parseInt(cliente_id),
                parseInt(valor),
                tipo,
                descricao
            ]
        )
        const { status, limite, saldo } = result.rows[0]

        if (status == 'error') {
            throw 'Saldo insuficiente'
        }


        res.end(JSON.stringify({
            limite,
            saldo
        }))
    } catch (err) {
        console.log(err)
        res.writeHead(422, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: err }))
    }
}
