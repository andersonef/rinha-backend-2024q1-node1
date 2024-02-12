module.exports = async function startDb(db) {
    await new Promise((resolve, reject) => db.run(
        'CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY, limite REAL, saldo REAL DEFAULT 0);',
        [],
        async (err) => (err) ? reject(err) : resolve(true)
     ))
     
    await new Promise((resolve, reject) => db.run('DELETE FROM clientes;', [], async (err) => (err) ? reject(err) : resolve(true)))

    await new Promise((resolve, reject) => db.run(
        'INSERT OR REPLACE INTO clientes (id, limite) VALUES (1, 100000), (2, 80000), (3, 1000000), (4, 10000000), (5, 500000);',
        [],
        async (err) => (err) ? reject(err) : resolve(true)
        
    ))

    await new Promise((resolve, reject) => db.run(
        'CREATE TABLE IF NOT EXISTS transacoes (id INTEGER PRIMARY KEY, id_cliente INTEGER, valor REAL, tipo VARCHAR, descricao VARCHAR, realizada_em DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_cliente) REFERENCES clientes(id));',
        [],
        async (err) => (err) ? reject(err) : resolve(true)
    ))

    await new Promise((resolve, reject) => db.run(
        'DELETE FROM transacoes;',
        [],
        async (err) => (err) ? reject(err) : resolve(true)
    ))

    await new Promise((resolve, reject) => db.run(
        'CREATE TRIGGER IF NOT EXISTS upd_clientes AFTER INSERT ON transacoes BEGIN UPDATE clientes SET saldo = saldo + (case when new.tipo = \'c\' THEN new.valor else new.valor * -1 END) WHERE id = new.id_cliente; END;',
        [],
        (err) => (err) ? reject(err) : resolve(true)
    ))
}
