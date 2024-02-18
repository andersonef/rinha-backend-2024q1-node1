const Queue = require('bull')
const db = require('../database/repository')
const Redis = require('ioredis')

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379

})

const novaTransacaoQueue = new Queue('nova-transacao', {
    redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379
    },
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false
    }
})

novaTransacaoQueue.process((job) => {
    const { cliente_id, valor, tipo, descricao, uid } = job.data
    console.log('CONSUMER DATA =>>> ', { jobdata: job.data, id: job.id })
    return new Promise(async (resolve, reject) => {
        try {
            await db.query(
                'INSERT INTO transacoes (id_cliente, valor, tipo, descricao, uid) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING;',
                [
                    cliente_id,
                    valor,
                    tipo,
                    descricao,
                    uid
                ]
            )
            resolve(true)
        } catch (err) {
            console.error('Erro ao inserir transação', err)
            reject(err)
        }
    })
})