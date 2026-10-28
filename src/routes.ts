import { Router } from 'express';
import { usuariosController } from './controllers/usuarios.controller';
import { mercadoriasController } from './controllers/mercadorias.controller';
import { clientesController } from './controllers/clientes.controller';
import { vendasController } from './controllers/vendas.controller';
import { autenticar } from './utils/http';

const routes = Router();

routes.post('/auth/login', usuariosController.login);
routes.post('/auth/refresh', usuariosController.refresh);

routes.use(autenticar);

routes.post('/usuarios', usuariosController.store);

routes.get('/mercadorias', mercadoriasController.index);
routes.post('/mercadorias', mercadoriasController.store);
routes.put('/mercadorias/:id', mercadoriasController.update);
routes.delete('/mercadorias/noStock', mercadoriasController.deletarNoStock);


routes.get('/clientes', clientesController.index);
routes.post('/clientes', clientesController.store);
routes.put('/clientes/:id', clientesController.update);

routes.get('/vendas', vendasController.index);
routes.get('/vendas/relatorio', vendasController.relatorio);
routes.get('/vendas/:id', vendasController.show);
routes.post('/vendas', vendasController.store);
routes.put('/vendas/:id/cancelar', vendasController.cancel);


export default routes;
