const fs = require('fs');
const path = require('path');

console.log('🚀 PostgreSQL Database Setup Helper');
console.log('====================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found');
} else {
  console.log('❌ .env.local file not found');
  console.log('\n📝 Note: Database credentials are hardcoded in lib/database.ts');
  console.log('Current configuration:');
  console.log('- DB_DIALECT: postgres');
  console.log('- DB_HOST: localhost');
  console.log('- DB_PORT: 5432');
  console.log('- DB_NAME: pos_db');
  console.log('- DB_USER: admin');
  console.log('- DB_PASSWORD: admin123');
  console.log('');
}

console.log('\n📋 Next Steps:');
console.log('1. Install PostgreSQL server');
console.log('2. Create the database: CREATE DATABASE pos_db;');
console.log('3. Run migrations: npx sequelize-cli db:migrate');
console.log('4. Run seeders: npx sequelize-cli db:seed:all');
console.log('5. Test connection: node scripts/test-database.js');
console.log('6. Start the app: npm run dev');
console.log('');

console.log('📖 For detailed instructions, see: DATABASE_SETUP.md');
console.log('');

// Check if PostgreSQL packages are installed
try {
  require('pg');
  console.log('✅ pg package is installed');
} catch (error) {
  console.log('❌ pg package not found');
  console.log('Run: npm install pg pg-hstore');
}

// Check if pg-hstore is installed
try {
  require('pg-hstore');
  console.log('✅ pg-hstore package is installed');
} catch (error) {
  console.log('❌ pg-hstore package not found');
  console.log('Run: npm install pg-hstore');
}

console.log('\n🎯 Quick Commands:');
console.log('- Test database: node scripts/test-database.js');
console.log('- Run migrations: npx sequelize-cli db:migrate');
console.log('- Run seeders: npx sequelize-cli db:seed:all');
console.log('- Test API: node scripts/test-api.js');
console.log('- Start dev server: npm run dev'); 