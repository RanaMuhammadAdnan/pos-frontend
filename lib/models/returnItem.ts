import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface ReturnItemAttributes {
  id: number;
  returnId: number;
  itemId: number;
  quantity: number;
  price: number;
  reason: string;
}

export type ReturnItemCreationAttributes = Optional<ReturnItemAttributes, 'id'>;

const ReturnItem = sequelize.define<Model<ReturnItemAttributes, ReturnItemCreationAttributes>>('ReturnItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  returnId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'returns', key: 'id' },
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'items', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'return_items',
  timestamps: false,
});

export default ReturnItem; 