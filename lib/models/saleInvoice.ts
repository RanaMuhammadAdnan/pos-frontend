import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface SaleInvoiceAttributes {
  id: number;
  invoiceNumber: string;
  customerId: number;
  invoiceDate: Date;
  subtotal: number;
  discountAmount: number;
  netAmount: number;
  totalAmount: number;
  remainingAmount: number;
  profit: number;
  status: 'complete' | 'pending' | 'returned';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  items?: any[];
}

export interface SaleInvoiceCreationAttributes extends Optional<SaleInvoiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class SaleInvoice extends Model<SaleInvoiceAttributes, SaleInvoiceCreationAttributes> implements SaleInvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public customerId!: number;
  public invoiceDate!: Date;
  public subtotal!: number;
  public discountAmount!: number;
  public netAmount!: number;
  public totalAmount!: number;
  public remainingAmount!: number;
  public profit!: number;
  public status!: 'complete' | 'pending' | 'returned';
  public notes?: string;
  public items?: any[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SaleInvoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    netAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    profit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'sale_invoices',
    timestamps: true,
  }
); 