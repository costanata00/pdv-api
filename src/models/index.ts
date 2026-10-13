import { sequelize } from '../db';
import { initModels } from './init-models';

const models = initModels(sequelize);

export const { clientes, usuarios, mercadorias, vendas, itens_venda } = models;
export { sequelize };
