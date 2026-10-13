import 'dotenv/config';
import { Sequelize } from 'sequelize';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL nao definida');

export const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  logging: false, // or: process.env.DB_LOG === 'true' ? console.log : false
  define: {
    timestamps: false,
  },
});