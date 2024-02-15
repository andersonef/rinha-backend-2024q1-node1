const { Pool } = require("pg");

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: process.env.MAX_CONNECTION_POOL || 20,
    idleTimeoutMillis: process.env.DB_MAX_IDLE_TIMEOUT || 30000,
    connectionTimeoutMillis: process.env.DB_TIMEOUT || 2000,
}

const pool = new Pool(config);

module.exports = {
    pool,
    query (sql, params) {
        return pool.query(sql, params)
    }
}