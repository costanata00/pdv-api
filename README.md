precisa do banco Ponto_Sequelize já existir

psql "postgresql://postgres:postgres@localhost:5433/Ponto_Sequelize" -f seed.sql

psql "DATABASE_URL" -f seed.sql

Para testar:


POST http://localhost:3000/login
Content-Type: application/json

{ "email": "admin@loja.com", "senha": "admin123" }


POST http://localhost:3000/usuarios
Content-Type: application/json
Authorization: Bearer <token retornado no login>

{
  "nome": "Fulano de Tal",
  "email": "Fulanodetal@gmail.com",
  "senha": "senha123",
  "ativo": true
}



CREATE DATABASE Ponto_Sequelize

CREATE TABLE usuarios ( id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, senha VARCHAR(32) NOT NULL, ativo BOOLEAN DEFAULT TRUE );

CREATE TABLE mercadorias ( id SERIAL PRIMARY KEY, codigo VARCHAR(50) NOT NULL, descricao VARCHAR(255) NOT NULL, preco NUMERIC(10,2) DEFAULT 0.00, estoque INT DEFAULT 0, ativo BOOLEAN DEFAULT TRUE );

CREATE TABLE clientes ( id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, cpf_cnpj VARCHAR(20), telefone VARCHAR(20), email VARCHAR(255), ativo BOOLEAN DEFAULT TRUE );

CREATE TABLE vendas ( id SERIAL PRIMARY KEY, cliente_id INT REFERENCES clientes(id) ON DELETE CASCADE, usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE, valor_total NUMERIC(10,2), data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP, status VARCHAR(50), pago BOOLEAN DEFAULT FALSE, forma_pag VARCHAR(50) );

CREATE TABLE itens_venda ( id SERIAL PRIMARY KEY, venda_id INT REFERENCES vendas(id) ON DELETE CASCADE, mercadoria_id INT REFERENCES mercadorias(id) ON DELETE CASCADE, quantidade INT, preco_unitario NUMERIC(10,2), valor_total NUMERIC(10,2) );