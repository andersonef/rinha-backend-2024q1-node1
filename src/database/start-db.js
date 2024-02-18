const db = require('./repository')

module.exports = async function startDb() {
    if (process.env.SERVER_ID != 1) {
        return
    }

    await db.query('CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY, limite INTEGER, saldo INTEGER DEFAULT 0);')
    await db.query('INSERT INTO clientes (id, limite) VALUES (1, 100000), (2, 80000), (3, 1000000), (4, 10000000), (5, 500000) ON CONFLICT DO NOTHING;')
    await db.query('CREATE TABLE IF NOT EXISTS transacoes (id SERIAL PRIMARY KEY, id_cliente INTEGER, valor INTEGER, tipo TEXT, descricao VARCHAR, realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, uid TEXT UNIQUE, FOREIGN KEY(id_cliente) REFERENCES clientes(id));')
    await db.query('DELETE FROM transacoes;')
    //await db.query('create or replace function fn_upd_clientes() returns TRIGGER as $$ begin update clientes set saldo = saldo + (case when new.tipo = \'c\' then new.valor else new.valor * -1.0 end) where id = new.id_cliente; return null; end; $$ language plpgsql;')
    await db.query(`
    CREATE OR REPLACE FUNCTION fn_add_transacao(p_id_cliente integer, p_valor integer, p_tipo text, p_descricao text) 
RETURNS TABLE (status text, saldo integer, limite integer) AS 
$$
DECLARE
   v_status text;
   v_saldo integer;
   v_limite integer;
   v_novo_saldo integer;
BEGIN
    -- Verifica se o cliente existe e obtém o saldo e o limite
    SELECT c.saldo, c.limite INTO v_saldo, v_limite FROM clientes c WHERE c.id = p_id_cliente;
	v_novo_saldo := v_saldo + (CASE WHEN p_tipo = 'c' THEN p_valor ELSE -p_valor end);
    -- Verifica se a transação é permitida
    IF v_novo_saldo >= -v_limite THEN
        -- Insere a transação
        INSERT INTO transacoes (id_cliente, valor, tipo, descricao) VALUES (p_id_cliente, p_valor, p_tipo, p_descricao);

        -- Atualiza o saldo do cliente
        
        UPDATE clientes SET saldo = v_novo_saldo WHERE id = p_id_cliente;

        v_status := 'success';
    ELSE
        v_status := 'error';
    END IF;


    -- Retorna os resultados
    RETURN QUERY SELECT v_status, (case when v_status = 'success' then v_novo_saldo else v_saldo end), v_limite;
END;
$$
LANGUAGE plpgsql;
    `)
    //await db.query('DROP TRIGGER IF EXISTS upd_clientes ON transacoes;')
    //await db.query('CREATE TRIGGER upd_clientes AFTER INSERT on transacoes FOR EACH ROW EXECUTE FUNCTION fn_upd_clientes();')
}
