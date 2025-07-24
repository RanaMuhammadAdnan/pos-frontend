import sequelize from './database';
import './models'; // Import all models to register them

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Initialize database when this module is imported
if (process.env.NODE_ENV !== 'production') {
  initializeDatabase().catch(console.error);
} 