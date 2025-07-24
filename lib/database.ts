import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  'pos_db',
  'admin',
  'admin123',
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize; 