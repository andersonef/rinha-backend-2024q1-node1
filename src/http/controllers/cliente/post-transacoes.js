const db = require('../../../database/repository')

module.exports = async function postTransacoes(req, res) {
    const cliente_id = req.params.id
    const { valor, tipo, descricao } = req.body
    console.log('dados pra post transação >>> ', valor, tipo, descricao)

    try {
        
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

        res.end(JSON.stringify({
            limite,
            saldo
        }))
    } catch (err) {
        console.log(err)
        res.writeHead(422, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: 'Saldo insuficiente' }))
    }
}
