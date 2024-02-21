ALTER SYSTEM SET max_connections = 300;
/*ALTER SYSTEM SET shared_buffers = "75MB";
ALTER SYSTEM SET effective_cache_size = "225MB";
ALTER SYSTEM SET maintenance_work_mem = "19200kB";
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = "2304kB";
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = "76kB";
ALTER SYSTEM SET huge_pages = off;
ALTER SYSTEM SET min_wal_size = "1GB";
ALTER SYSTEM SET max_wal_size = "4GB";*/

CREATE UNLOGGED TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY,
    limite INTEGER
);
INSERT INTO clientes (id, limite) VALUES (1, 100000), (2, 80000), (3, 1000000), (4, 10000000), (5, 500000) ON CONFLICT DO NOTHING;


CREATE UNLOGGED TABLE IF NOT EXISTS transacoes_1 (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER default 1,
    limite INTEGER default 100000,
    valor INTEGER,
    tipo TEXT,
    descricao VARCHAR,
    realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo INTEGER check (saldo >= -limite),
    id_transacao_anterior INTEGER,
    FOREIGN KEY(id_transacao_anterior) REFERENCES transacoes_1(id)
);
CREATE UNLOGGED TABLE IF NOT EXISTS transacoes_2 (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER default 2,
    limite INTEGER default 80000,
    valor INTEGER,
    tipo TEXT,
    descricao VARCHAR,
    realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo INTEGER check (saldo >= -limite),
    id_transacao_anterior INTEGER,
    FOREIGN KEY(id_transacao_anterior) REFERENCES transacoes_2(id)
);
CREATE UNLOGGED TABLE IF NOT EXISTS transacoes_3 (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER default 3,
    limite INTEGER default 1000000,
    valor INTEGER,
    tipo TEXT,
    descricao VARCHAR,
    realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo INTEGER check (saldo >= -limite),
    id_transacao_anterior INTEGER,
    FOREIGN KEY(id_transacao_anterior) REFERENCES transacoes_3(id)
);
CREATE UNLOGGED TABLE IF NOT EXISTS transacoes_4 (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER default 4,
    limite INTEGER default 10000000,
    valor INTEGER,
    tipo TEXT,
    descricao VARCHAR,
    realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo INTEGER check (saldo >= -limite),
    id_transacao_anterior INTEGER,
    FOREIGN KEY(id_transacao_anterior) REFERENCES transacoes_4(id)
);
CREATE UNLOGGED TABLE IF NOT EXISTS transacoes_5 (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER default 5,
    limite INTEGER default 500000,
    valor INTEGER,
    tipo TEXT,
    descricao VARCHAR,
    realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo INTEGER check (saldo >= -limite),
    id_transacao_anterior INTEGER,
    FOREIGN KEY(id_transacao_anterior) REFERENCES transacoes_5(id)
);


CREATE OR REPLACE FUNCTION fn_add_transacao(p_id_cliente integer, p_valor INTEGER, p_tipo text, p_descricao text) 
RETURNS TABLE (status text, saldo INTEGER, limite integer) AS 
$$
DECLARE
    v_inserted_id INTEGER;
    v_query text;
    v_query_result text;
BEGIN

    v_query := 'INSERT INTO transacoes_' || p_id_cliente || ' (id_cliente, valor, tipo, descricao, saldo, id_transacao_anterior) VALUES (' || p_id_cliente || ', ' || p_valor || ', ''' || p_tipo || ''', ''' || p_descricao || ''', lag(saldo, 1) over (order by realizada_em desc) + (case when ''' || p_tipo || ''' = ''c'' then ''' || p_valor || ''' else ''-' || p_valor || ''', lag(id, 1) over(order by realizada_em desc))) RETURNING id into v_inserted_id;';
    EXECUTE v_query;

    v_query_result := 'select ''success'', saldo, limite FROM transacoes_' || p_id_cliente || ' WHERE id = ' || v_inserted_id;

    RETURN QUERY EXECUTE v_query_result;
    --RETURN QUERY SELECT 'success', saldo, limite FROM transacoes_' || p_id_cliente || ' WHERE id = v_inserted_id;
END;
$$
LANGUAGE plpgsql;