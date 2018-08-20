const crypto = require('crypto');
const digits = '1234567890'.split('');
const vector = Buffer('passwordpassword', 'utf8').slice(0, 16);

module.exports = function({
  password,
  algorithm = 'aes-128-cbc',
  domain = digits,
  iv
}) {
  if (!password) {
    throw new Error('`password` is required');
  }

  if (password.length !== 16) {
    throw new Error('`password` must be 16 long');
  }

  if (!iv) {
    throw new Error('`iv` is required');
  }

  if (iv.length !== 16) {
    throw new Error('`iv` must be 16 long');
  }


  function enc(text) {
    const cipher = crypto.createCipheriv(algorithm, password, iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  // create a permutation of domain
  const sorted = domain
    .map(c => c)
    .sort((c1, c2) => enc(c1).localeCompare(enc(c2)));
  const encTable = {};
  const decTable = {};

  for (let i in domain) {
    encTable[domain[i]] = sorted[i];
    decTable[sorted[i]] = domain[i];
  }

  function validate(text, result) {
    if (text.length !== result.length) {
      throw new Error(
        `some of the input characters are not in the cipher's domain: [${domain}]`
      );
    }
  }

  function encrypt(text) {
    if (typeof text !== 'string') {
      throw new Error('input is not a string');
    }
    const encrypted = text
      .split('')
      .map(c => encTable[c])
      .join('');
    validate(text, encrypted);
    return encrypted;
  }

  function decrypt(text) {
    if (typeof text !== 'string') {
      throw new Error('input is not a string');
    }
    const decrypted = text
      .split('')
      .map(c => decTable[c])
      .join('');
    validate(text, decrypted);
    return decrypted;
  }

  return { encrypt, decrypt };
};
