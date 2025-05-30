const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db', // Usa 'db' come host
  user: process.env.DB_USER || 'francesco',
  password: process.env.DB_PASSWORD || 'fra',
  database: process.env.DB_NAME || 'PV',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;