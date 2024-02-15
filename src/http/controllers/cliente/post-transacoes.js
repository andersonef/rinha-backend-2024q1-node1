const validar_transacao = require('../../../validators/transacao-validator')
const db = require('../../../database/repository')

module.exports = async function postTransacoes(req, res) {
    const { cliente_id } = req
    const { valor, tipo, descricao } = req.req.body

    try {
        const { limite, saldo } = await validar_transacao(cliente_id, valor, tipo)

        await db.query(
            'INSERT INTO transacoes (id_cliente, valor, tipo, descricao) VALUES ($1, $2, $3, $4);',
            [
                cliente_id,
                valor,
                tipo,
                descricao
            ]
        )

        res.end(JSON.stringify({
            limite,
            saldo
        }))
    } catch (err) {
        console.log(err)
        res.writeHead(422, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: 'Saldo insuficiente' }))
        return
    }
}
