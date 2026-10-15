import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { mercadorias, mercadoriasId } from './mercadorias';
import type { vendas, vendasId } from './vendas';

export interface itens_vendaAttributes {
  id: number;
  venda_id?: number;
  mercadoria_id?: number;
  quantidade?: number;
  preco_unitario?: number;
  valor_total?: number;
}

export type itens_vendaPk = "id";
export type itens_vendaId = itens_venda[itens_vendaPk];
export type itens_vendaOptionalAttributes = "id" | "venda_id" | "mercadoria_id" | "quantidade" | "preco_unitario" | "valor_total";
export type itens_vendaCreationAttributes = Optional<itens_vendaAttributes, itens_vendaOptionalAttributes>;

export class itens_venda extends Model<itens_vendaAttributes, itens_vendaCreationAttributes> implements itens_vendaAttributes {
  id!: number;
  venda_id?: number;
  mercadoria_id?: number;
  quantidade?: number;
  preco_unitario?: number;
  valor_total?: number;

  
  // itens_venda belongsTo mercadorias via mercadoria_id
  mercadorium!: mercadorias;
  getMercadorium!: Sequelize.BelongsToGetAssociationMixin<mercadorias>;
  setMercadorium!: Sequelize.BelongsToSetAssociationMixin<mercadorias, mercadoriasId>;
  createMercadorium!: Sequelize.BelongsToCreateAssociationMixin<mercadorias>;
  // itens_venda belongsTo vendas via venda_id
  venda!: vendas;
  getVenda!: Sequelize.BelongsToGetAssociationMixin<vendas>;
  setVenda!: Sequelize.BelongsToSetAssociationMixin<vendas, vendasId>;
  createVenda!: Sequelize.BelongsToCreateAssociationMixin<vendas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof itens_venda {
    return itens_venda.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    venda_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vendas',
        key: 'id'
      }
    },
    mercadoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mercadorias',
        key: 'id'
      }
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preco_unitario: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    valor_total: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'itens_venda',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "itens_venda_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
