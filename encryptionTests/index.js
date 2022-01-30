import { Buffer } from 'buffer'
import { randomBytes, hkdfSync, pbkdf2Sync, scryptSync, createCipheriv, createDecipheriv } from 'crypto'

const algorithm = 'aes-256-cbc'
const salt = randomBytes(16)
console.log(salt)
// User's email
const username = 'freddi@gmail.com'
// User's password
const secret = randomBytes(64)
const key = pbkdf2Sync(secret, salt, 1000, 64, 'sha512')
const iv = randomBytes(16)
const clearText = '{"bookmarks": [{"link": "a"}, {"link": "c"}, {"link": "b"}], "passwords": [{"name": "a", "password": "aaa"}]}'

console.log('SALT: ', salt.toString('hex'))
console.log('PBKDF-KEY: ', key.toString('hex'))
console.log('IV: ', iv.toString('hex'))

const derivedKey = hkdfSync('sha512', key, 'salt', 'info', 32)
console.log('HKDF-KEY: ', Buffer.from(derivedKey).toString('hex'))

// Source: https://www.geeksforgeeks.org/node-js-crypto-createdecipheriv-method/
// An encrypt function
function encrypt(text) {
  // Creating Cipheriv with its parameter
  const cipher = createCipheriv(algorithm, Buffer.from(derivedKey), iv)
  // Updating text
  let encrypted = cipher.update(text)
  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()])

  // Returning iv and encrypted data
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

// A decrypt function
function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex')
  let encryptedText = Buffer.from(text.encryptedData, 'hex')

  // Creating Decipher
  let decipher = createDecipheriv(algorithm, Buffer.from(derivedKey), iv)

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  // returns data after decryption
  return decrypted.toString()
}

// Encrypts output
var output = encrypt(clearText)
console.log(output)

const authKey = scryptSync(derivedKey, username, 64)
console.log('HASHED AUTHKEY: ', authKey)

// Decrypts output
console.log(decrypt(output))
