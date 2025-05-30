require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendPasswordResetEmail } = require('./emailService');

const { hasSequential, hasRepetition, isPwned } = require('./passwordValidation.js');
const { encrypt, decrypt } = require('./encryption.js'); 
const pool = require('./db');

const app = express();
const port = 8000;

// Inizializza il client OAuth2
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
// Endpoint per il sign-up
app.post('/signupHandler', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const encryptedPassword = encrypt(password); // Usa encrypt invece di bcrypt
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(query, [email, encryptedPassword]);
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
      const decryptedPassword = decrypt(user.password); // Decripta la password dal DB
      if (password === decryptedPassword) {
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

app.put('/updateItem/:id', async (req, res) => {
  const { id } = req.params;
  const { tag, username, password, website, folder_id } = req.body;

  if (!tag && !username && !password && !website && folder_id === undefined) {
    return res.status(400).json({ error: 'At least one field is required to update!' });
  }

  try {
    // Costruisci dinamicamente la query in base ai campi forniti
    const updates = [];
    const values = [];
    let index = 1;
    let securityLevel = null; // Variabile per il livello di sicurezza

    if (tag) {
      updates.push(`tag = $${index}`);
      values.push(tag);
      index++;
    }

    if (username) {
      updates.push(`username = $${index}`);
      values.push(username);
      index++;
    }

    if (password) {
      // Crittografa la password prima di salvarla
      const encryptedPassword = encrypt(password);
      updates.push(`password = $${index}`);
      values.push(encryptedPassword);
      index++;

      // Ricalcola il livello di sicurezza della nuova password
      securityLevel = await getPasswordHealth(password);
      updates.push(`security = $${index}`);
      values.push(securityLevel);
      index++;
    }

    if (website) {
      updates.push(`website = $${index}`);
      values.push(website);
      index++;
    }

    if (folder_id !== undefined) {
      updates.push(`folder_id = $${index}`);
      values.push(folder_id);
      index++;
    }

    values.push(id); // Aggiungi l'ID come ultimo parametro
    const query = `UPDATE password SET ${updates.join(', ')} WHERE id = $${index}`;

    await pool.query(query, values);

    res.status(200).json({ message: 'Item updated successfully', securityLevel });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento dell\'item:', err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento dell\'item' });
  }
});

app.delete('/deleteItem/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM password WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Elemento non trovato' });
    }

    res.status(200).json({ message: 'Elemento eliminato con successo' });
  } catch (err) {
    console.error('Errore durante l\'eliminazione dell\'elemento:', err);
    res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'elemento' });
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

app.delete('/deleteFolder/:id', async (req, res) => {
  const folderId = req.params.id;
  try {
    // Elimina prima le associazioni con gli utenti (se usi una tabella folder_users)
    await pool.query('DELETE FROM folder_users WHERE folder_id = $1', [folderId]);
    // Elimina tutti gli item associati alla cartella (se vuoi)
    await pool.query('DELETE FROM password WHERE folder_id = $1', [folderId]);
    // Elimina la cartella
    await pool.query('DELETE FROM folders WHERE id = $1', [folderId]);
    res.status(200).json({ message: 'Cartella eliminata con successo' });
  } catch (err) {
    console.error('Errore durante l\'eliminazione della cartella:', err);
    res.status(500).json({ error: 'Errore durante l\'eliminazione della cartella' });
  }
});

//==================== ENDPOINT GET ==========================

app.get('/api/items', async (req, res) => {
  const userId = req.query.user_id;
  const folderId = req.query.folder_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required!' });
  }

  try {
    let queryText = `
      SELECT 
        p.id, 
        p.tag, 
        p.username, 
        p.password, 
        p.website, 
        p.folder_id, 
        p.security, 
        f.name AS folder_name,
        f.shared AS folder_shared,
        u.email AS owner_email -- <--- AGGIUNGI QUESTO
      FROM password p
      LEFT JOIN folders f ON p.folder_id = f.id
      LEFT JOIN users u ON p.user_id = u.id -- <--- AGGIUNGI QUESTO
      WHERE (
        p.user_id = $1
        OR p.folder_id IN (
          SELECT folder_id FROM folder_users WHERE user_id = $1
        )
      )
    `;
    const queryParams = [userId];
    if (folderId && folderId !== '0') {
      queryText += ' AND p.folder_id = $2';
      queryParams.push(folderId);
    }
    queryText += ' ORDER BY p.id ASC';
    const result = await pool.query(queryText, queryParams);

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
          folderId: row.folder_id !== null ? row.folder_id : 0,
          folderName: row.folder_name || 'No Folder',
          securityLevel,
          sharedFolder: row.folder_shared === 1,
          owner_email: row.owner_email
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
        owner.email AS owner_email,
        f.shared, 
        ARRAY_AGG(DISTINCT u.email) FILTER (WHERE u.email IS NOT NULL) AS shared_with
      FROM folders f
      LEFT JOIN users owner ON f.created_by = owner.id
      LEFT JOIN folder_users fu ON f.id = fu.folder_id
      LEFT JOIN users u ON fu.user_id = u.id
      WHERE f.created_by = $1 OR f.id IN (
        SELECT folder_id FROM folder_users WHERE user_id = $1
      )
      GROUP BY f.id, owner.email
    `;
    const result = await pool.query(query, [userId]);

    const folders = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      created_by: row.created_by,
      owner_email: row.owner_email,
      shared: row.shared === 1,
      shared_with: row.shared_with || [],
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
        password,
        created_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    let password = user.password;
    try {
      password = decrypt(user.password); // decripta se serve
      console.log('Password decriptata:', password); // <--- AGGIUNGI QUESTO LOG
    } catch (e) {
      console.error('Errore nella decriptazione:', e);
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      password, // restituisci la password
      created_at: user.created_at,
    });
  } catch (err) {
    console.error('Errore durante il recupero dell\'account:', err);
    res.status(500).json({ error: 'Errore durante il recupero dell\'account' });
  }
});

app.put('/api/users/:userId/password', async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old and new password are required' });
  }

  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentDecrypted = decrypt(result.rows[0].password);
    if (oldPassword !== currentDecrypted) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    const encryptedNew = encrypt(newPassword);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [encryptedNew, userId]);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento della password:', err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento della password' });
  }
});

// Endpoint per condividere una cartella con un utente
app.post('/share', async (req, res) => {
  const { email, folderId } = req.body;

  if (!email || !folderId) {
    return res.status(400).json({ error: 'Email and folder ID are required' });
  }

  try {
    // Verifica se l'email esiste nel database
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Verifica se la cartella è condivisa
    const folderResult = await pool.query('SELECT shared FROM folders WHERE id = $1', [folderId]);
    if (folderResult.rows.length === 0 || folderResult.rows[0].shared === 0) {
      return res.status(400).json({ error: 'Folder is not shared or does not exist' });
    }

    // Aggiungi l'utente alla tabella folder_users
    await pool.query(
      'INSERT INTO folder_users (folder_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [folderId, userId]
    );

    res.status(200).json({ message: 'Folder shared successfully' });
  } catch (err) {
    console.error('Error sharing folder:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Endpoint per rimuovere la condivisione di una cartella per un utente
app.put('/api/folders/:folderId/remove-shared-user', async (req, res) => {
  const { folderId } = req.params;
  const { email } = req.body;

  if (!folderId || !email) {
    return res.status(400).json({ error: 'Folder ID and email are required' });
  }

  try {
    // Trova l'id dell'utente tramite email
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    // Rimuovi la riga dalla tabella folder_users
    await pool.query('DELETE FROM folder_users WHERE folder_id = $1 AND user_id = $2', [folderId, userId]);

    res.status(200).json({ message: 'Condivisione rimossa con successo' });
  } catch (err) {
    console.error('Errore durante la rimozione della condivisione:', err);
    res.status(500).json({ error: 'Errore durante la rimozione della condivisione' });
  }
});

//==================== ENDPOINT PER PASSWORD RESET ==========================

// Endpoint per richiedere il reset della password
app.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Verifica se l'utente esiste
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Genera un token casuale
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Imposta la scadenza a 1 ora da ora
    const expiresAt = new Date(Date.now() + 3600000); // 1 ora in millisecondi

    // Salva il token nel database
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, resetToken, expiresAt]
    );

    // Invia l'email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Endpoint per verificare il token e resettare la password
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    // Verifica il token
    const tokenResult = await pool.query(
      'SELECT user_id, used FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const userId = tokenResult.rows[0].user_id;

    // Cripta la nuova password
    const encryptedPassword = encrypt(newPassword);

    // Aggiorna la password dell'utente
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [encryptedPassword, userId]);

    // Marca il token come usato
    await pool.query('UPDATE password_reset_tokens SET used = true WHERE token = $1', [token]);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

//==================== ENDPOINT PER LOGIN CON GOOGLE ==========================

// Endpoint per il login con Google
app.post('/auth/google', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Cerca l'utente nel database
    let result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    let userId;

    if (result.rows.length === 0) {
      // L'utente non esiste, crealo
      // Genera una password casuale per l'account (non sarà mai usata per il login diretto)
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const encryptedPassword = encrypt(randomPassword);

      const insertResult = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        [email, encryptedPassword]
      );
      userId = insertResult.rows[0].id;
    } else {
      userId = result.rows[0].id;
    }

    res.status(200).json({ 
      message: 'Login successful',
      user_id: userId
    });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(401).json({ error: 'Authentication failed' });
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