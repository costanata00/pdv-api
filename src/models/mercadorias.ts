import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { itens_venda, itens_vendaId } from './itens_venda';

export interface mercadoriasAttributes {
  id: number;
  codigo: string;
  descricao: string;
  preco?: number;
  estoque?: number;
  ativo?: boolean;
}

export type mercadoriasPk = "id";
export type mercadoriasId = mercadorias[mercadoriasPk];
export type mercadoriasOptionalAttributes = "id" | "preco" | "estoque" | "ativo";
export type mercadoriasCreationAttributes = Optional<mercadoriasAttributes, mercadoriasOptionalAttributes>;

export class mercadorias extends Model<mercadoriasAttributes, mercadoriasCreationAttributes> implements mercadoriasAttributes {
  id!: number;
  codigo!: string;
  descricao!: string;
  preco?: number;
  estoque?: number;
  ativo?: boolean;

  // mercadorias hasMany itens_venda via mercadoria_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof mercadorias {
    return mercadorias.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    preco: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.00
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'mercadorias',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mercadorias_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
