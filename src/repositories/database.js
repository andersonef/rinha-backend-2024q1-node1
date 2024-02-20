const { Pool } = require("pg");

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: process.env.MAX_CONNECTION_POOL || 20,
    idleTimeoutMillis: process.env.DB_MAX_IDLE_TIMEOUT || 30000,
    connectionTimeoutMillis: process.env.DB_TIMEOUT || 4000,
}
console.log(config)

const pool = new Pool(config);
pool.once('error', (err) => {
    console.error('ERRO DB', err)
})

module.exports = {
    pool,
    async query (sql, params) {
        try {
            return this.pool.query(sql, params)
        } finally {
            //client.release()
        }
    }
}