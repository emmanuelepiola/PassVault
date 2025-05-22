const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const axios = require('axios');
const crypto = require('crypto');

const { hasSequential, hasRepetition, isPwned } = require('./passwordValidation.js');
const { encrypt, decrypt } = require('./encryption.js'); 
const pool = require('./db');

const app = express();
const port = 8000;

// Middleware per il parsing del corpo delle richieste
app.use(bodyParser.json());

// Middleware per gestire le richieste CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');  
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//==================== ENDPOINT PER AUTENTICAZIONE ==========================

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

//==================== ENDPOINT PER PASSWORD ==========================

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
app.post('/checkPasswordHealth', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password è richiesta' });
    }

    let score = 0;
    const suggestions = [];

    if (password.length >= 12) score++;
    else suggestions.push('Usa almeno 12 caratteri');

    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    else suggestions.push('Mescola maiuscole e minuscole');

    if (/\d/.test(password)) score++;
    else suggestions.push('Inserisci almeno un numero');

    if (/[!@#$%^&*()\-_=+\[\]{};:,.<>?]/.test(password)) score++;
    else suggestions.push('Inserisci almeno un simbolo speciale');

    if (!hasSequential(password) && !hasRepetition(password)) score++;
    else suggestions.push('Evita sequenze (es. 1234, abcd) o caratteri ripetuti');

    const compromised = await isPwned(password);
    if (!compromised) score++;
    else suggestions.push('Questa password è già stata compromessa');

    let health;
    if (score >= 5) health = 3;
    else if (score >= 3) health = 2;
    else health = 1;

    return res.json({ health, score, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

//==================== ENDPOINT ITEMS ==========================

app.post('/addItem', async (req, res) => {
  const { user_id, tag, username, password, website, folder_id } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ error: 'User ID and password are required!' });
  }

  try {
    // Calcola il livello di sicurezza della password in chiaro
    const security = await getPasswordHealth(password);

    // Crittografa la password
    const encryptedPassword = encrypt(password);

    // Gestisci il folder_id
    const validFolderId = folder_id && folder_id !== '0' ? folder_id : null;

    // Salva l'elemento nel database
    const result = await pool.query(
      'INSERT INTO password (user_id, tag, username, password, website, folder_id, security) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [
        user_id,
        tag,
        username,
        encryptedPassword, // Salva la password crittografata
        website,
        validFolderId,
        security, // Salva il livello di sicurezza calcolato
      ]
    );

    res.status(201).json({ message: 'Item aggiunto!', item_id: result.rows[0].id, securityLevel: security });
  } catch (err) {
    console.error('Errore durante il salvataggio:', err);
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

//==================== ENDPOINT FOLDERS ==========================

app.post('/addFolder', async (req, res) => {
  const { name, user_id, shared } = req.body;

  if (!name || !user_id) {
    return res.status(400).json({ error: 'Name and User ID are required!' });
  }

  try {
    // Converti il valore shared in un numero (0 o 1)
    const sharedValue = shared ? 1 : 0;

    const result = await pool.query(
      'INSERT INTO folders (name, created_by, shared) VALUES ($1, $2, $3) RETURNING id',
      [name, user_id, sharedValue]
    );

    const folderId = result.rows[0].id;
    res.status(201).json({ message: 'Folder created successfully', folder_id: folderId });
  } catch (err) {
    console.error('Errore durante la creazione della cartella:', err);
    res.status(500).json({ error: 'Errore durante la creazione della cartella' });
  }
});

app.put('/updateFolder/:id', async (req, res) => {
  const { id } = req.params;
  const { name, shared } = req.body;

  if (!name && shared === undefined) {
    return res.status(400).json({ error: 'Name or shared flag is required!' });
  }

  try {
    // Costruisci dinamicamente la query in base ai campi forniti
    const updates = [];
    const values = [];
    let index = 1;

    if (name) {
      updates.push(`name = $${index}`);
      values.push(name);
      index++;
    }

    if (shared !== undefined) {
      // Converti il valore booleano shared in un numero (0 o 1)
      const sharedValue = shared ? 1 : 0;
      updates.push(`shared = $${index}`);
      values.push(sharedValue);
      index++;
    }

    values.push(id); // Aggiungi l'ID come ultimo parametro
    const query = `UPDATE folders SET ${updates.join(', ')} WHERE id = $${index}`;

    await pool.query(query, values);

    res.status(200).json({ message: 'Folder updated successfully' });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento della cartella:', err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento della cartella' });
  }
});

//==================== ENDPOINT GET ==========================

app.get('/api/items', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required!' });
  }

  try {
    const query = `
      SELECT 
        p.id, 
        p.tag, 
        p.username, 
        p.password, 
        p.website, 
        p.folder_id, 
        p.security, 
        f.name AS folder_name
      FROM password p
      LEFT JOIN folders f ON p.folder_id = f.id
      WHERE p.user_id = $1
    `;
    const result = await pool.query(query, [userId]);

    const items = await Promise.all(
      result.rows.map(async (row) => {
        const decryptedPassword = decrypt(row.password);
        let securityLevel;
        if (row.security === 1) securityLevel = 'low';
        else if (row.security === 2) securityLevel = 'medium';
        else if (row.security === 3) securityLevel = 'high';
        else securityLevel = await getPasswordHealth(decryptedPassword) === 3 ? 'high' : 'unknown';

        return {
          id: row.id,
          tag: row.tag,
          username: row.username,
          password: decryptedPassword,
          website: row.website,
          folderID: row.folder_id || '0',
          folderName: row.folder_name || 'No Folder',
          securityLevel,
        };
      })
    );

    res.status(200).json({ items });
  } catch (err) {
    console.error('Errore durante il recupero degli elementi:', err);
    res.status(500).json({ error: 'Errore durante il recupero degli elementi' });
  }
});

app.get('/api/folders', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required!' });
  }

  try {
    const query = `
      SELECT 
        f.id, 
        f.name, 
        f.created_by, 
        f.shared, 
        ARRAY_AGG(u.email) FILTER (WHERE u.email IS NOT NULL) AS shared_with
      FROM folders f
      LEFT JOIN folder_users fu ON f.id = fu.folder_id
      LEFT JOIN users u ON fu.user_id = u.id
      WHERE f.created_by = $1 OR fu.user_id = $1
      GROUP BY f.id
    `;
    const result = await pool.query(query, [userId]);

    const folders = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      created_by: row.created_by,
      shared: row.shared === 1, // Converti il valore numerico in booleano
      shared_with: row.shared_with || [], // Array di email con cui la cartella è condivisa
    }));

    res.status(200).json({ folders });
  } catch (err) {
    console.error('Errore durante il recupero delle cartelle:', err);
    res.status(500).json({ error: 'Errore durante il recupero delle cartelle' });
  }
});

app.get('/api/users/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required!' });
  }

  try {
    const query = `
      SELECT 
        id, 
        email, 
        created_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (err) {
    console.error('Errore durante il recupero dell\'account:', err);
    res.status(500).json({ error: 'Errore durante il recupero dell\'account' });
  }
});

//==================== FUNZIONE BOH ==========================

// Funzione asincrona per valutare la sicurezza della password
async function getPasswordHealth(password) {
  let score = 0;
  // 1. Lunghezza minima 12+
  if (password.length >= 12) score++;
  // 2. Maiuscole + minuscole
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  // 3. Almeno una cifra
  if (/\d/.test(password)) score++;
  // 4. Almeno un simbolo speciale
  if (/[!@#$%^&*()\\-_=+\\[\\]{};:,.<>?]/.test(password)) score++;
  // 5. Nessuna sequenza o ripetizione
  if (!hasSequential(password) && !hasRepetition(password)) score++;
  // 6. Non compromessa
  const compromised = await isPwned(password);
  if (!compromised) score++;
  // Mappatura score → livello (1–3)
  if (score >= 5) return 3;
  if (score >= 3) return 2;
  return 1;
}

// Avvia il server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});