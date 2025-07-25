import User from './user';
import Vendor from './vendor';
import Item from './item';
import City from './city';
import Customer from './customer';
import { SaleInvoice } from './saleInvoice';
import { SaleInvoiceItem } from './saleInvoiceItem';
import PurchaseInvoice from './purchaseInvoice';
import PurchaseInvoiceItem from './purchaseInvoiceItem';
import Expense from './expense';
import PaymentHistory from './paymentHistory';
import Return from './return';
import ReturnItem from './returnItem';

// Associations
Vendor.hasMany(Item, { foreignKey: 'vendorId', as: 'items' });
Item.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

PurchaseInvoice.hasMany(PurchaseInvoiceItem, { foreignKey: 'purchaseInvoiceId', as: 'items' });
PurchaseInvoiceItem.belongsTo(PurchaseInvoice, { foreignKey: 'purchaseInvoiceId' });

PurchaseInvoiceItem.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
Item.hasMany(PurchaseInvoiceItem, { foreignKey: 'itemId' });

PurchaseInvoice.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
Vendor.hasMany(PurchaseInvoice, { foreignKey: 'vendorId', as: 'purchaseInvoices' });

SaleInvoice.hasMany(SaleInvoiceItem, { foreignKey: 'saleInvoiceId', as: 'items' });
SaleInvoiceItem.belongsTo(SaleInvoice, { foreignKey: 'saleInvoiceId' });

SaleInvoiceItem.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
Item.hasMany(SaleInvoiceItem, { foreignKey: 'itemId' });

SaleInvoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(SaleInvoice, { foreignKey: 'customerId' });

Customer.belongsTo(City, { foreignKey: 'cityId', as: 'city' });
City.hasMany(Customer, { foreignKey: 'cityId', as: 'customers' });

PaymentHistory.belongsTo(SaleInvoice, { foreignKey: 'saleInvoiceId' });
SaleInvoice.hasMany(PaymentHistory, { foreignKey: 'saleInvoiceId' });

Return.hasMany(ReturnItem, { foreignKey: 'returnId' });
ReturnItem.belongsTo(Return, { foreignKey: 'returnId' });

ReturnItem.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(ReturnItem, { foreignKey: 'itemId' });

export {
  User,
  Vendor,
  Item,
  City,
  Customer,
  SaleInvoice,
  SaleInvoiceItem,
  PurchaseInvoice,
  PurchaseInvoiceItem,
  Expense,
  PaymentHistory,
  Return,
  ReturnItem,
}; 