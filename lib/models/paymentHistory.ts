import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';
import { SaleInvoice } from './saleInvoice';

export interface PaymentHistoryAttributes {
  id: number;
  saleInvoiceId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentHistoryCreationAttributes extends Omit<PaymentHistoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PaymentHistory extends Model<PaymentHistoryAttributes, PaymentHistoryCreationAttributes> {
  public id!: number;
  public saleInvoiceId!: number;
  public amount!: number;
  public paymentMethod!: string;
  public paymentDate!: Date;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PaymentHistory.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'payment_history',
    timestamps: true,
  }
);

// Define associations
PaymentHistory.belongsTo(SaleInvoice, { foreignKey: 'saleInvoiceId' });
SaleInvoice.hasMany(PaymentHistory, { foreignKey: 'saleInvoiceId' });

export default PaymentHistory; 