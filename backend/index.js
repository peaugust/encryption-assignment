import { syncDb, setupDb, db } from './db/db.js'
import { randomBytes, scryptSync, pbkdf2Sync } from 'crypto'

let database = undefined

export const initialize = async (dbPassword) => {
  setupDb(dbPassword)
  await syncDb()
}

const createHashedAuthToken = (username, authToken) => {
  const hashedAuthToken = scryptSync(authToken, username, 64)
  return hashedAuthToken
}

export const signIn = async (username, authToken) => {
  // Create the hashed authentication token
  const hashedAuthToken = createHashedAuthToken(username, authToken)
  // Compare if the DB has an user that matches with the username and hashedAuthToken given
  try {
    const result = await db['User'].findByPk(hashedAuthToken)
    if (result) {
      return { error: false, response: result.encryptedData }
    } else {
      return { error: true, message: '\n-----------------------\n ** User not found ** \n-----------------------\n' }
    }
  } catch (err) {
    return { error: true, message: err.message }
  }
}

export const signUp = async (username, authToken, encryptedData) => {
  // Create the hashed authentication token
  const hashedAuthToken = createHashedAuthToken(username, authToken)
  try {
    await db['User'].create({ email: username, authKey: hashedAuthToken, encryptedData })
    return { error: false, response: `\n----------------------------------------\n ** ${username} was successfully registered! ** \n----------------------------------------\n` }
  } catch (err) {
    const response =
      err.errors[0].message == 'email must be unique'
        ? '\n----------------------------------------------\n ** ERROR: This email is already in use  ** \n----------------------------------------------\n'
        : err.errors[0].message ?? 'Something wrong happened'
    return { error: true, response }
  }
}

export const updateEncryptedData = async (username, authToken, encryptedData) => {
  // Create the hashed authentication token
  const hashedAuthToken = createHashedAuthToken(username, authToken)

  try {
    // Get the user using the Primary Key
    const result = await db['User'].findByPk(hashedAuthToken)

    // Override the encrypted data
    result.encryptedData = encryptedData

    // Save the operation in the DB
    await result.save()
    return {
      error: false,
      response: `\n----------------------------------------\n **${username} bookmarks were successfully updated!** \n----------------------------------------\n`,
    }
  } catch (err) {
    return { error: true, response: err.errors[0].message }
  }
}

const getPbkdfKey = async (key) => {
  const salt = await getSalt()
  return pbkdf2Sync(key, salt, 1000, 64, 'sha512')
}

export const getSalt = async () => {
  const result = await db['Secret'].findByPk('SALT')
  if (result) {
    return result.value
  } else {
    const salt = randomBytes(64)
    await db['Secret'].create({ name: 'SALT', value: salt })
    return getSalt()
  }
}

export const getIv = async () => {
  const result = await db['Secret'].findByPk('IV')
  if (result) {
    return result.value
  } else {
    const iv = await getPbkdfKey(randomBytes(16))
    await db['Secret'].create({ name: 'IV', value: iv })
    return getIv()
  }
}

// For manual testing
// const username = 'lorem.ipsum@gmail.com'
// const authToken = 'e38f3254ff1bf6891813abfe30b8d3b467afac74b6621d3c8027d6339337a973'
// const encryptedData =
//   '88fd1bff66470c904295e4e43d9867a277c4d86d1d992a6551dd667eae61992aa40e027721ebb2dd5dcfdddbd7b08a298456e565c734490d570eefda0f3f0c04511091a13fa1f33191a8e41aa808328df849668461348f9eb1e1d62637339d68a9c380639f4bf5d2df61e3509bc2d61d'

// await signUp(username, authToken, encryptedData)

// await signIn(username, authToken)

// await updateEncryptedData(username, authToken, '000000')
