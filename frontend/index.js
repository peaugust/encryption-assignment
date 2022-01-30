import { signUp, signIn, getSalt, getIv } from '../backend/index.js'
import { hkdfSync, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto'

const STORAGE = []

// [] -> 0
// [{...}] -> 1
// [{...}, {...}] -> 2

export const registerUser = async (email, password, favoriteWebsites) => {
  const userEmail = email
  const userFavoriteWebsites = JSON.stringify(favoriteWebsites)
  const userId = STORAGE.length + 1

  const hkdfKey = await getHkdfKey(await getPbkdfKey(password))
  console.log(userFavoriteWebsites)
  const response = await signUp(userEmail, hkdfKey, await encryptData(userFavoriteWebsites, hkdfKey))

  if (!response.error) STORAGE.push({ userId, userEmail, userPassword: hkdfKey, userFavoriteWebsites })

  return response
}

export const updateEmail = (email) => {
  const newLogin = email

  console.log('newLogin', newLogin)
  // send data
}

export const updatePassword = (password) => {
  const newFavoriteWebsites = password

  console.log('newFavoriteWebsites', newPassword)
  // send data
}

export const updateFavoriteWebsites = (favoriteWebsites) => {
  let array
  const newFavoriteWebsites = array.push(favoriteWebsites)

  console.log('newFavoriteWebsites', newFavoriteWebsites)
  // send data
}

export const getLocalUsers = () => STORAGE.map((user) => `${user.userId} - ${user.userEmail}`)

export const getUserById = (id) => STORAGE.filter((user) => user.userId == id)

export const login = async (email, password) => {
  const hkdfKey = await getHkdfKey(await getPbkdfKey(password))
  const response = await signIn(email, hkdfKey)
  console.log('XANFS', response)
  const decryptedData = await decryptData(response.response.encryptedData, hkdfKey)
  console.log(decryptedData)
  // TODO: Review this response
  return response
}

const getPbkdfKey = async (password) => {
  console.log(password, typeof password)
  const salt = await getSalt()
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512')
}

const getHkdfKey = async (password) => {
  console.log(password, typeof password)

  const salt = await getSalt()
  return hkdfSync('sha512', password, salt, 'info', 32)
}

const encryptData = async (clearData, key) => {
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), await getIv().toString('hex'))
  let encrypted = cipher.update(clearData)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return encrypted.toString('hex')
}

const decryptData = async (encryptedData, key) => {
  let encryptedDataBuffer = Buffer.from(encryptedData, 'hex')
  let decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), await getIv().toString('hex'))
  let decrypted = decipher.update(Buffer.from(encryptedDataBuffer))
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}
