const validar_transacao = require('../../../validators/transacao-validator')
module.exports = async function postTransacoes(req, res, db) {
    const { cliente_id } = req
    const { valor, tipo, descricao } = req.req.body

    try {
        const { limite, saldo } = await validar_transacao(db, cliente_id, valor, tipo)

        await new Promise(async (resolve, reject) => db.run(
            'INSERT INTO transacoes (id_cliente, valor, tipo, descricao) VALUES (?, ?, ?, ?);',
            [
                cliente_id,
                valor,
                tipo,
                descricao
            ],
            (err) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(true)
            }
        ))

        res.end(JSON.stringify({
            limite,
            saldo
        }))
    } catch (err) {
        res.writeHead(422, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ erro: 'Saldo insuficiente' }))
        return
    }
}
