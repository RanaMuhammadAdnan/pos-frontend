import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface CityAttributes {
  id: number;
  name: string;
  state?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CityCreationAttributes = Optional<CityAttributes, 'id' | 'createdAt' | 'updatedAt'>;

const City = sequelize.define<Model<CityAttributes, CityCreationAttributes>>('City', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'cities',
  timestamps: true,
});

export default City; 