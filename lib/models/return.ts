import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface ReturnAttributes {
  id: number;
  type: 'sale' | 'purchase';
  invoiceId: number;
  date: Date;
  total: number;
}

export type ReturnCreationAttributes = Optional<ReturnAttributes, 'id'>;

const Return = sequelize.define<Model<ReturnAttributes, ReturnCreationAttributes>>('Return', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('sale', 'purchase'),
    allowNull: false,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'returns',
  timestamps: false,
});

export default Return; 