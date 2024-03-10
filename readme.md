# Rinha de Backend Q1 2024 - Node

Projeto criado para participar da rinha de backend do Q1 2024.

## Tecnologias

- Node
- Redis
- Nginx
- PostgreSQL

## Requisitos

- Docker

## Como rodar

Rodando a versão de produção, que usa a imagem remota do docker

```bash
docker-compose up
```

Rodando a versão de desenvolvimento, que usa o próprio repo para buildar

```bash
docker-compose -f docker-compose-dev.yml up
```

A aplicação estará disponível para requisições na URL http://localhost:9999 com os seguintes endpoints:

```
GET /clientes/:id/extrato
```

```
POST /clientes/:id/transacoes

{
    "valor": 100000,
    "tipo" : "c",
    "descricao" : "descricao"
}
```