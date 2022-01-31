import { signUp, signIn, updateEncryptedData, getSalt, getIv, initialize } from '../backend/index.js'
import { hkdfSync, pbkdf2Sync, createCipheriv, createDecipheriv } from 'crypto'

const STORAGE = []

// [] -> 0
// [{...}] -> 1
// [{...}, {...}] -> 2

export const initSystem = (password) => {
  return initialize(password)
}

export const registerUser = async (email, password, favoriteWebsites) => {
  const userEmail = email
  const userFavoriteWebsites = JSON.stringify(favoriteWebsites)
  const userId = STORAGE.length + 1

  const hkdfKey = await getHkdfKey(await getPbkdfKey(password))
  const encryptedFavoritesResponse = await encryptData(userFavoriteWebsites, hkdfKey)

  if (encryptedFavoritesResponse.error) {
    return encryptedFavoritesResponse.response
  }

  const { error, response } = await signUp(userEmail, hkdfKey, encryptedFavoritesResponse.response)

  if (!error) STORAGE.push({ userId, userEmail, userPassword: hkdfKey, userFavoriteWebsites: favoriteWebsites })

  return { error, response }
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

export const getLocalUsers = () => STORAGE.map((user) => `${user.userId} - ${user.userEmail}`)

export const getUserById = (id) => STORAGE.filter((user) => user.userId == id)

export const login = async (email, password) => {
  const hkdfKey = await getHkdfKey(await getPbkdfKey(password))

  if (STORAGE.find((userLogged) => userLogged.userEmail == email)) {
    return {
      error: true,
      response:
        '\n------------------------------------------\n** This user was already logged on the local storage. To see this user account please select in the Main Menu the option: Access user account**\n------------------------------------------\n',
    }
  }

  const { error, response } = await signIn(email, hkdfKey)
  if (error) {
    return { error, response }
  }

  console.log(response)
  const decryptedDataResponse = await decryptData(response.encryptedData, hkdfKey)

  if (decryptedDataResponse.error) {
    return decryptedDataResponse
  }

  const id = STORAGE.length + 1

  STORAGE.push({ userId: id, userEmail: email, userPassword: hkdfKey, userFavoriteWebsites: decryptedDataResponse.response })

  console.log('DECRYPTED DATA: ', decryptedDataResponse.response)

  return { error: false, response: STORAGE[id - 1] }
}

const getPbkdfKey = async (password) => {
  const salt = await getSalt()
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512')
}

const getHkdfKey = async (password) => {
  console.log(password, typeof password)

  const salt = await getSalt()
  return hkdfSync('sha512', password, salt, 'info', 32)
}

const encryptData = async (clearData, key) => {
  try {
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), await getIv().toString('hex'))
    let encrypted = cipher.update(clearData)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return { error: false, response: encrypted.toString('hex') }
  } catch (err) {
    return { error: true, response: '\n--------------------\n ** Something went wrong while encrypting your data ** \n--------------------\n' }
  }
}

const decryptData = async (encryptedData, key) => {
  try {
    let encryptedDataBuffer = Buffer.from(encryptedData, 'hex')
    let decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), await getIv().toString('hex'))
    let decrypted = decipher.update(Buffer.from(encryptedDataBuffer))
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return { error: false, response: JSON.parse(decrypted.toString()) }
  } catch (err) {
    console.log(err)
    return { error: true, response: '\n--------------------\n ** Something went wrong while decrypting your data ** \n--------------------\n' }
  }
}

export const getAllBookmarks = (id) => {
  const user = getUserById(id)[0]
  if (user && user.userFavoriteWebsites.length > 0) {
    const formattedBookmarks = user.userFavoriteWebsites.map((bookmark) => `${Object.keys(bookmark)[0]} - ${Object.values(bookmark)[0]}`)
    return { error: false, response: formattedBookmarks }
  } else {
    return {
      error: true,
      response: '\n-------------------------------------------------\n ** Bookmarks not found for this user ** \n-------------------------------------------------\n',
    }
  }
}

export const addNewBookmark = async (id, bookmark) => {
  const user = getUserById(id)[0]

  user.userFavoriteWebsites.push(bookmark)

  const bookmarks = JSON.stringify(user.userFavoriteWebsites)

  const encryptedBookmarksResponse = await encryptData(bookmarks, user.userPassword)

  if (encryptedBookmarksResponse.error) {
    return encryptedBookmarksResponse.response
  } else {
    const request = updateEncryptedData(user.userEmail, user.userPassword, encryptedBookmarksResponse.response)

    return request
  }
}
