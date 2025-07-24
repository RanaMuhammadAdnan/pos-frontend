import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface PurchaseInvoiceItemAttributes {
  id: number;
  purchaseInvoiceId: number;
  itemId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PurchaseInvoiceItemCreationAttributes extends Optional<PurchaseInvoiceItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class PurchaseInvoiceItem extends Model<PurchaseInvoiceItemAttributes, PurchaseInvoiceItemCreationAttributes> implements PurchaseInvoiceItemAttributes {
  public id!: number;
  public purchaseInvoiceId!: number;
  public itemId!: number;
  public quantity!: number;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PurchaseInvoiceItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseInvoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'purchase_invoices', key: 'id' },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'items', key: 'id' },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
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
    modelName: 'PurchaseInvoiceItem',
    tableName: 'purchase_invoice_items',
    timestamps: true,
  }
);

export default PurchaseInvoiceItem; 