import { Router } from 'express';
import { usuariosController } from './controllers/usuarios.controller';
import { mercadoriasController } from './controllers/mercadorias.controller';
import { clientesController } from './controllers/clientes.controller';
import { vendasController } from './controllers/vendas.controller';
import { itensVendaController } from './controllers/itens-venda.controller';
import { autenticar } from './utils/http';
import { vendasService } from './services/vendas.service';

const routes = Router();

routes.post('/auth/login', usuariosController.login);

routes.use(autenticar);

routes.get('/usuarios', usuariosController.index);
routes.get('/usuarios/:id', usuariosController.show);
routes.post('/usuarios', usuariosController.store);
routes.put('/usuarios/:id', usuariosController.update); 

//routes.delete('/usuarios/:id', usuariosController.destroy); //sai

routes.get('/mercadorias', mercadoriasController.index);
routes.get('/mercadorias/:id', mercadoriasController.show);
routes.post('/mercadorias', mercadoriasController.store);
routes.put('/mercadorias/:id', mercadoriasController.update);

//routes.delete('/mercadorias/:id', mercadoriasController.destroy); //sai

routes.get('/clientes', clientesController.index);
routes.get('/clientes/:id', clientesController.show);
routes.post('/clientes', clientesController.store);
routes.put('/clientes/:id', clientesController.update);

//routes.delete('/clientes/:id', clientesController.destroy); //sai


routes.get('/vendas', vendasController.index); 
routes.get('/vendas/:id', vendasController.show);
routes.post('/vendas', vendasController.store); //encaminha p service



//routes.post('/vendas', vendasController.store);//service cuida
routes.put('/vendas/:id', vendasController.update);
routes.put('/vendas/:id/cancelar', vendasController.cancel); //fica pra cancelar


routes.get('/vendas/:id/itens', itensVendaController.indexByVenda);
routes.get('/itens-venda/:id', itensVendaController.show);
//routes.post('/itens-venda', itensVendaController.store);//sai
//routes.put('/itens-venda/:id', itensVendaController.update);//sai
//routes.delete('/itens-venda/:id', itensVendaController.destroy);//sai

export default routes;