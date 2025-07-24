import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../database';
import Vendor from './vendor';

interface ItemAttributes {
  id: number;
  name: string;
  sku: string;
  sellingPrice: number;
  tax?: number; // Direct tax amount (not percentage)
  discount?: number; // Direct discount amount (not percentage)
  netPrice?: number;
  grossPrice?: number;
  minStockLevel: number;
  currentStock: number;
  vendorId?: number;
  isActive: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id' | 'currentStock' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public sku!: string;
  public sellingPrice!: number;
  public tax!: number;
  public discount!: number;
  public minStockLevel!: number;
  public currentStock!: number;
  public vendorId!: number;
  public isActive!: boolean;
  public description!: string;
  public grossPrice!: number;
  public netPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  toJSON() {
    const values = Object.assign({}, this.get());
    values.netPrice = this.netPrice;
    return values;
  }
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    sellingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    grossPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Direct tax amount (e.g., 5.00 for Rs 5 tax)',
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Direct discount amount (e.g., 2.00 for Rs 2 discount)',
    },
    netPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    minStockLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['sku'],
      },
      {
        fields: ['vendorId'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default Item; 