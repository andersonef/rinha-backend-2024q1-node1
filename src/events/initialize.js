const db = require('../repositories/database')
const redis = require('../repositories/redis')
module.exports = async function initialize() {
    const server_id = process.env.SERVER_ID || 1
    if (server_id != 1) {
        console.error('não é o servidor 1', process.env.SERVER_ID)
        return
    }

    const clientes = await db.query('SELECT * FROM clientes')
    clientes.rows.forEach(async (cliente) => {
        console.log(`inicializando limite do cliente ${cliente.id} com valor ${cliente.limite}`)
        await redis.redis.set(`limite:${cliente.id}`, cliente.limite)
        await redis.redis.set(`saldo:${cliente.id}`, 0)
    })
}