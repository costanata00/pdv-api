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
  "nome": "Fernanda Alves",
  "email": "fernanda@loja.com",
  "senha": "fernanda123",
  "ativo": true
}


a fazer

service de venda
permissões/cargos
filtragem em query
