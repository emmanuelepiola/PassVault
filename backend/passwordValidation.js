const crypto = require('crypto');
const axios = require('axios');

// Controlla sequenze alfabetiche o numeriche di 3+ caratteri
function hasSequential(str) {
  const seqLen = 3;
  for (let i = 0; i <= str.length - seqLen; i++) {
    const slice = str.slice(i, i + seqLen).toLowerCase();
    const codes = slice.split('').map(c => c.charCodeAt(0));
    if (codes[0] + 1 === codes[1] && codes[1] + 1 === codes[2]) return true;
    if (codes[0] - 1 === codes[1] && codes[1] - 1 === codes[2]) return true;
  }
  return false;
}

// Controlla 3+ caratteri identici consecutivi
function hasRepetition(str) {
  return /(.)\1\1/.test(str);
}

// Verifica compromissione via API k-anonymity di HaveIBeenPwned
async function isPwned(password) {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const res = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
  return res.data
    .split('\r\n')
    .some(line => line.split(':')[0] === suffix);
}

module.exports = { hasSequential, hasRepetition, isPwned };