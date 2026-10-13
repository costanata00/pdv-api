import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import { ForeignKeyConstraintError, ValidationError } from 'sequelize';
import { sequelize } from './models';
import routes from './routes';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});
app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
});


// Middleware de erro (4 argumentos)
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // ValidationError cobre validacoes do model e UniqueConstraintError
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.errors.map((e) => e.message) });
    return;
  }
  // Ex.: venda com clienteId que nao existe
  if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({ error: 'Referencia invalida (cliente, usuario ou mercadoria inexistente)' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
};
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  await sequelize.authenticate();
  // Apenas para estudo: cria as tabelas a partir dos models.
  // Em projeto real, troque por migrations (sequelize-cli).
  await sequelize.sync();
  app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Falha ao iniciar:', err);
  process.exit(1);
});
