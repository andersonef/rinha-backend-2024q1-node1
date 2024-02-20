const db = require('../repositories/database')
const redis_repository = require('../repositories/redis')

redis_repository.redis.subscribe('nova-transacao', (err, count) => {
    if (err) {
        console.error('Erro ao inscrever no canal nova-transacao', err)
        return
    }
    console.log('Inscrito no canal nova-transacao')
})

redis_repository.redis.on('message', async (channel, message) => {
    const { cliente_id, valor, tipo, descricao, uid } = JSON.parse(message)

    await db.query(
        'select * from fn_add_transacao($1, $2, $3, $4, $5);',
        [
            cliente_id,
            valor,
            tipo,
            descricao,
            uid
        ]
    )
})