import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface CustomerAttributes {
  id: number;
  name: string;
  phone: string;
  address: string;
  email?: string;
  cityId?: number;
}

export type CustomerCreationAttributes = Optional<CustomerAttributes, 'id'>;

const Customer = sequelize.define<Model<CustomerAttributes, CustomerCreationAttributes>>('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cities',
      key: 'id',
    },
  },
}, {
  tableName: 'customers',
  timestamps: true,
});

export default Customer; 