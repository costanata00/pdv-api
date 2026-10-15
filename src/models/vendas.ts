import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { itens_venda, itens_vendaId } from './itens_venda';
import type { usuarios, usuariosId } from './usuarios';

export interface vendasAttributes {
  id: number;
  cliente_id?: number;
  usuario_id?: number;
  valor_total?: number;
  data_venda?: Date;
  status?: string;
  pago?: boolean;
  forma_pag?: string;
}

export type vendasPk = "id";
export type vendasId = vendas[vendasPk];
export type vendasOptionalAttributes = "id" | "cliente_id" | "usuario_id" | "valor_total" | "data_venda" | "status" | "pago" | "forma_pag";
export type vendasCreationAttributes = Optional<vendasAttributes, vendasOptionalAttributes>;

export class vendas extends Model<vendasAttributes, vendasCreationAttributes> implements vendasAttributes {
  id!: number;
  cliente_id?: number;
  usuario_id?: number;
  valor_total?: number;
  data_venda?: Date;
  status?: string;
  pago?: boolean;
  forma_pag?: string;

  // vendas belongsTo clientes via cliente_id
  cliente!: clientes;
  getCliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // vendas belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;
  // vendas hasMany itens_venda via venda_id
  itens_vendas!: itens_venda[];
  getItens_vendas!: Sequelize.HasManyGetAssociationsMixin<itens_venda>;
  setItens_vendas!: Sequelize.HasManySetAssociationsMixin<itens_venda, itens_vendaId>;
  addItens_venda!: Sequelize.HasManyAddAssociationMixin<itens_venda, itens_vendaId>;
  addItens_vendas!: Sequelize.HasManyAddAssociationsMixin<itens_venda, itens_vendaId>;
  createItens_venda!: Sequelize.HasManyCreateAssociationMixin<itens_venda>;
  removeItens_venda!: Sequelize.HasManyRemoveAssociationMixin<itens_venda, itens_vendaId>;
  removeItens_vendas!: Sequelize.HasManyRemoveAssociationsMixin<itens_venda, itens_vendaId>;
  hasItens_venda!: Sequelize.HasManyHasAssociationMixin<itens_venda, itens_vendaId>;
  hasItens_vendas!: Sequelize.HasManyHasAssociationsMixin<itens_venda, itens_vendaId>;
  countItens_vendas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof vendas {
    return vendas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    valor_total: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    data_venda: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pago: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    forma_pag: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vendas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vendas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
