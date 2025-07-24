import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface SaleInvoiceItemAttributes {
  id: number;
  saleInvoiceId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaleInvoiceItemCreationAttributes extends Optional<SaleInvoiceItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class SaleInvoiceItem extends Model<SaleInvoiceItemAttributes, SaleInvoiceItemCreationAttributes> implements SaleInvoiceItemAttributes {
  public id!: number;
  public saleInvoiceId!: number;
  public itemId!: number;
  public quantity!: number;
  public unitPrice!: number;
  public discount!: number;
  public total!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SaleInvoiceItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saleInvoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sale_invoices',
        key: 'id',
      },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'sale_invoice_items',
    timestamps: true,
  }
); 