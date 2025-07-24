import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface VendorAttributes {
  id: number;
  name: string;
  phone: string;
  address: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VendorCreationAttributes = Optional<VendorAttributes, 'id' | 'createdAt' | 'updatedAt'>;

const Vendor = sequelize.define<Model<VendorAttributes, VendorCreationAttributes>>('Vendor', {
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
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'vendors',
  timestamps: true,
});

export default Vendor; 