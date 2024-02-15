const ROUTES = [
    {
        method: 'POST',
        pattern: /^\/clientes\/\d+\/transacoes$/,
        controller: require('./controllers/cliente/post-transacoes')
    },
    {
        method: 'GET',
        pattern: /^\/clientes\/\d+\/extrato$/,
        controller: require('./controllers/cliente/get-extrato')
    }
]

module.exports = async function validarUrl(req, res) {
    const route = ROUTES.find(route => route.method === req.method && route.pattern.test(req.url))

    if (!route) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({erro: 'Rota não encontrada'}))

        return
    }

    await route.controller(
        {
            req,
            cliente_id: req.url.match(/\d+/)[0]
        }, 
        res
    )
}