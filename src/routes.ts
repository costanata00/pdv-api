import { Router } from 'express';
import { usuariosController } from './controllers/usuarios.controller';
import { mercadoriasController } from './controllers/mercadorias.controller';
import { clientesController } from './controllers/clientes.controller';
import { vendasController } from './controllers/vendas.controller';
import { itensVendaController } from './controllers/itens-venda.controller';
import { autenticar } from './utils/http';

const routes = Router();

routes.post('/auth/login', usuariosController.login);
routes.use(autenticar);

routes.get('/usuarios', usuariosController.index);
routes.get('/usuarios/:id', usuariosController.show);
routes.post('/usuarios', usuariosController.store);
routes.put('/usuarios/:id', usuariosController.update);
routes.delete('/usuarios/:id', usuariosController.destroy);

routes.get('/mercadorias', mercadoriasController.index);
routes.get('/mercadorias/:id', mercadoriasController.show);
routes.post('/mercadorias', mercadoriasController.store);
routes.put('/mercadorias/:id', mercadoriasController.update);
routes.delete('/mercadorias/:id', mercadoriasController.destroy);

routes.get('/clientes', clientesController.index);
routes.get('/clientes/:id', clientesController.show);
routes.post('/clientes', clientesController.store);
routes.put('/clientes/:id', clientesController.update);
routes.delete('/clientes/:id', clientesController.destroy);

routes.get('/vendas', vendasController.index);
routes.get('/vendas/:id', vendasController.show);
routes.post('/vendas', vendasController.store);
routes.put('/vendas/:id', vendasController.update);
routes.delete('/vendas/:id', vendasController.destroy);

routes.get('/vendas/:id/itens', itensVendaController.indexByVenda);
routes.get('/itens-venda/:id', itensVendaController.show);
routes.post('/itens-venda', itensVendaController.store);
routes.put('/itens-venda/:id', itensVendaController.update);
routes.delete('/itens-venda/:id', itensVendaController.destroy);

export default routes;