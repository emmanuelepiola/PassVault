const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = 8000;

// Configurazione del database
const pool = new Pool({
  host: process.env.DB_HOST || 'db', // Usa 'db' come host
  user: process.env.DB_USER || 'francesco',
  password: process.env.DB_PASSWORD || 'fra',
  database: process.env.DB_NAME || 'PV',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;

// Middleware per il parsing del corpo delle richieste
app.use(bodyParser.json());

// Middleware per gestire le richieste CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Endpoint per il sign-up
app.post('/signupHandler', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2)';
    await pool.query(query, [email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
  }
});

// Endpoint per il login
app.post('/loginHandler', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const query = 'SELECT password FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

// Endpoint per verificare l'email
app.post('/checkEmailHandler', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    const count = parseInt(result.rows[0].count, 10);

    if (count > 0) {
      res.status(200).json({ message: 'Email exists' });
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to check email', details: error.message });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});