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
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(query, [email, hashedPassword]);
    const userId = result.rows[0].id;

    res.status(201).json({ message: 'User registered successfully', user_id: userId });
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
    const query = 'SELECT id, email, password FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Restituisci l'id come identificatore utente
        return res.status(200).json({ message: 'Login successful', user_id: user.id });
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

// Endpoint per generare una password sicura
app.post('/generatePassword', (req, res) => {
  const {
    length = 12,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
    uppercaseCount,
    lowercaseCount,
    numbersCount,
    symbolsCount,
  } = req.body;

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{};:,.<>?';

  // Determina se la modalità è custom per ogni categoria
  const isUpperCustom = typeof uppercaseCount === 'number';
  const isLowerCustom = typeof lowercaseCount === 'number';
  const isNumCustom = typeof numbersCount === 'number';
  const isSymCustom = typeof symbolsCount === 'number';

  let passwordArray = [];

  // Inserisci i caratteri custom richiesti
  if (uppercase && isUpperCustom) {
    for (let i = 0; i < uppercaseCount; i++) {
      passwordArray.push(uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)));
    }
  }
  if (lowercase && isLowerCustom) {
    for (let i = 0; i < lowercaseCount; i++) {
      passwordArray.push(lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)));
    }
  }
  if (numbers && isNumCustom) {
    for (let i = 0; i < numbersCount; i++) {
      passwordArray.push(numberChars.charAt(Math.floor(Math.random() * numberChars.length)));
    }
  }
  if (symbols && isSymCustom) {
    for (let i = 0; i < symbolsCount; i++) {
      passwordArray.push(symbolChars.charAt(Math.floor(Math.random() * symbolChars.length)));
    }
  }

  // Crea il pool SOLO con le categorie in modalità random
  let randomPool = '';
  if (uppercase && !isUpperCustom) randomPool += uppercaseChars;
  if (lowercase && !isLowerCustom) randomPool += lowercaseChars;
  if (numbers && !isNumCustom) randomPool += numberChars;
  if (symbols && !isSymCustom) randomPool += symbolChars;

  // Riempi il resto della password SOLO con caratteri dal pool random
  while (passwordArray.length < length && randomPool.length > 0) {
    passwordArray.push(randomPool.charAt(Math.floor(Math.random() * randomPool.length)));
  }

  // Se la password è ancora troppo corta (es: tutte custom ma somma < length), riempi con tutte le categorie selezionate
  let fallbackPool = '';
  if (uppercase) fallbackPool += uppercaseChars;
  if (lowercase) fallbackPool += lowercaseChars;
  if (numbers) fallbackPool += numberChars;
  if (symbols) fallbackPool += symbolChars;
  while (passwordArray.length < length && fallbackPool.length > 0) {
    passwordArray.push(fallbackPool.charAt(Math.floor(Math.random() * fallbackPool.length)));
  }

  // Mischia l'array per evitare pattern fissi
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  const password = passwordArray.slice(0, length).join('');
  res.json({ password });
});


// Endpoint utilizzabile per verificare il security level
app.post('/checkPasswordHealth', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()\-_=+\[\]{};:,.<>?]/.test(password)) score++;

  // Classificazione: 1 = debole, 2 = media, 3 = forte
  let health = 1;
  if (score >= 3) health = 3;
  else if (score === 2) health = 2;

  res.json({ health });
});

function getPasswordHealth(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()\-_=+\[\]{};:,.<>?]/.test(password)) score++;

  // Classificazione: 1 = debole, 2 = media, 3 = forte
  if (score >= 3) return 3;
  if (score === 2) return 2;
  return 1;
}

app.post('/addItem', async (req, res) => {
  const { user_id, tag, username, password, website, folder_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required!' });
  }

  try {
    const security = getPasswordHealth(password);

    const validFolderId = folder_id && folder_id !== '0' ? folder_id : null;

    await pool.query(
      'INSERT INTO password (user_id, tag, username, password, website, folder_id, security) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        user_id,
        tag,
        username,
        password,
        website, // Usa il campo website
        validFolderId,
        security,
      ]
    );
    res.status(201).json({ message: 'Item aggiunto!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

app.post('/addFolder', async (req, res) => {
  const { name, user_id } = req.body;

  if (!name || !user_id) {
    return res.status(400).json({ error: 'Name and User ID are required!' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO folders (name) VALUES ($1) RETURNING id',
      [name]
    );

    const folderId = result.rows[0].id;

    // Aggiungi la relazione tra la cartella e l'utente nella tabella folder_users
    await pool.query(
      'INSERT INTO folder_users (folder_id, user_id) VALUES ($1, $2)',
      [folderId, user_id]
    );

    res.status(201).json({ message: 'Folder created successfully', folder_id: folderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella creazione della cartella' });
  }
});

app.put('/updateFolder/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required!' });
  }

  try {
    await pool.query('UPDATE folders SET name = $1 WHERE id = $2', [name, id]);
    res.status(200).json({ message: 'Folder name updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento del nome della cartella' });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});