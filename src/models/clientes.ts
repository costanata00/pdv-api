import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { vendas, vendasId } from './vendas';

export interface clientesAttributes {
  id: number;
  nome: string;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  ativo?: boolean;
}

export type clientesPk = "id";
export type clientesId = clientes[clientesPk];
export type clientesOptionalAttributes = "id" | "cpf_cnpj" | "telefone" | "email" | "ativo";
export type clientesCreationAttributes = Optional<clientesAttributes, clientesOptionalAttributes>;

export class clientes extends Model<clientesAttributes, clientesCreationAttributes> implements clientesAttributes {
  id!: number;
  nome!: string;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  ativo?: boolean;

  // clientes hasMany vendas via cliente_id
  vendas!: vendas[];
  getVendas!: Sequelize.HasManyGetAssociationsMixin<vendas>;
  setVendas!: Sequelize.HasManySetAssociationsMixin<vendas, vendasId>;
  addVenda!: Sequelize.HasManyAddAssociationMixin<vendas, vendasId>;
  addVendas!: Sequelize.HasManyAddAssociationsMixin<vendas, vendasId>;
  createVenda!: Sequelize.HasManyCreateAssociationMixin<vendas>;
  removeVenda!: Sequelize.HasManyRemoveAssociationMixin<vendas, vendasId>;
  removeVendas!: Sequelize.HasManyRemoveAssociationsMixin<vendas, vendasId>;
  hasVenda!: Sequelize.HasManyHasAssociationMixin<vendas, vendasId>;
  hasVendas!: Sequelize.HasManyHasAssociationsMixin<vendas, vendasId>;
  countVendas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof clientes {
    return clientes.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cpf_cnpj: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'clientes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
