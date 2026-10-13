import type { Sequelize } from "sequelize";
import { clientes as _clientes } from "./clientes";
import type { clientesAttributes, clientesCreationAttributes } from "./clientes";
import { itens_venda as _itens_venda } from "./itens_venda";
import type { itens_vendaAttributes, itens_vendaCreationAttributes } from "./itens_venda";
import { mercadorias as _mercadorias } from "./mercadorias";
import type { mercadoriasAttributes, mercadoriasCreationAttributes } from "./mercadorias";
import { usuarios as _usuarios } from "./usuarios";
import type { usuariosAttributes, usuariosCreationAttributes } from "./usuarios";
import { vendas as _vendas } from "./vendas";
import type { vendasAttributes, vendasCreationAttributes } from "./vendas";

export {
  _clientes as clientes,
  _itens_venda as itens_venda,
  _mercadorias as mercadorias,
  _usuarios as usuarios,
  _vendas as vendas,
};

export type {
  clientesAttributes,
  clientesCreationAttributes,
  itens_vendaAttributes,
  itens_vendaCreationAttributes,
  mercadoriasAttributes,
  mercadoriasCreationAttributes,
  usuariosAttributes,
  usuariosCreationAttributes,
  vendasAttributes,
  vendasCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const clientes = _clientes.initModel(sequelize);
  const itens_venda = _itens_venda.initModel(sequelize);
  const mercadorias = _mercadorias.initModel(sequelize);
  const usuarios = _usuarios.initModel(sequelize);
  const vendas = _vendas.initModel(sequelize);

  vendas.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(vendas, { as: "vendas", foreignKey: "cliente_id"});
  itens_venda.belongsTo(mercadorias, { as: "mercadorium", foreignKey: "mercadoria_id"});
  mercadorias.hasMany(itens_venda, { as: "itens_vendas", foreignKey: "mercadoria_id"});
  vendas.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(vendas, { as: "vendas", foreignKey: "usuario_id"});
  itens_venda.belongsTo(vendas, { as: "venda", foreignKey: "venda_id"});
  vendas.hasMany(itens_venda, { as: "itens_vendas", foreignKey: "venda_id"});

  return {
    clientes: clientes,
    itens_venda: itens_venda,
    mercadorias: mercadorias,
    usuarios: usuarios,
    vendas: vendas,
  };
}
