import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { vendas, vendasId } from './vendas';

export interface usuariosAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo?: boolean;
}

export type usuariosPk = "id";
export type usuariosId = usuarios[usuariosPk];
export type usuariosOptionalAttributes = "id" | "ativo";
export type usuariosCreationAttributes = Optional<usuariosAttributes, usuariosOptionalAttributes>;

export class usuarios extends Model<usuariosAttributes, usuariosCreationAttributes> implements usuariosAttributes {
  id!: number;
  nome!: string;
  email!: string;
  senha!: string;
  ativo?: boolean;

  // usuarios hasMany vendas via usuario_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof usuarios {
    return usuarios.init({
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "usuarios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
