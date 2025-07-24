import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface PurchaseInvoiceAttributes {
  id: number;
  invoiceNumber: string;
  vendorId: number;
  date: Date;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PurchaseInvoiceCreationAttributes extends Optional<PurchaseInvoiceAttributes, 'id' | 'total' | 'createdAt' | 'updatedAt'> {}

class PurchaseInvoice extends Model<PurchaseInvoiceAttributes, PurchaseInvoiceCreationAttributes> implements PurchaseInvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public vendorId!: number;
  public date!: Date;
  public total!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PurchaseInvoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'vendors', key: 'id' },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'PurchaseInvoice',
    tableName: 'purchase_invoices',
    timestamps: true,
  }
);

export default PurchaseInvoice; 