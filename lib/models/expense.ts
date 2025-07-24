import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

export interface ExpenseAttributes {
  id: number;
  description: string;
  amount: number;
  date: Date;
}

export type ExpenseCreationAttributes = Optional<ExpenseAttributes, 'id'>;

const Expense = sequelize.define<Model<ExpenseAttributes, ExpenseCreationAttributes>>('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'expenses',
  timestamps: false,
});

export default Expense; 