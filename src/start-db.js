const db = require('./database/repository')

module.exports = async function startDb() {
    await db.query('CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY, limite REAL, saldo REAL DEFAULT 0);')
    await db.query('INSERT INTO clientes (id, limite) VALUES (1, 100000), (2, 80000), (3, 1000000), (4, 10000000), (5, 500000) ON CONFLICT DO NOTHING;')
    await db.query('CREATE TABLE IF NOT EXISTS transacoes (id SERIAL PRIMARY KEY, id_cliente INTEGER, valor REAL, tipo TEXT, descricao VARCHAR, realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_cliente) REFERENCES clientes(id));')
    await db.query('DELETE FROM transacoes;')
    await db.query('create or replace function fn_upd_clientes() returns TRIGGER as $$ begin update clientes set saldo = saldo + (case when new.tipo = \'c\' then new.valor else new.valor * -1.0 end) where id = new.id_cliente; return null; end; $$ language plpgsql;')
    await db.query('CREATE OR REPLACE TRIGGER upd_clientes AFTER INSERT on transacoes FOR EACH ROW EXECUTE FUNCTION fn_upd_clientes();')
}
