import { scryptSync } from 'crypto'
import { syncDb, setupDb, db } from './db/db.js'

let database = undefined

export const initialize = async (dbPassword) => {
  setupDb(dbPassword)
  await syncDb()
  // console.log('init', db)
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
    // console.log('DATABASE', database)
    const result = await db['User'].findByPk(hashedAuthToken)
    // If success return the encrypted data
    // console.log('RESULT', result)
  } catch (err) {
    // If error retrun an error message
    // console.log('ERROR', err)
  }
}

export const signUp = async (username, authToken, encryptedData) => {
  // Create the hashed authentication token
  const hashedAuthToken = createHashedAuthToken(username, authToken)

  try {
    const result = await db['User'].create({ email: username, authKey: hashedAuthToken, encryptedData: encryptedData })
    return { error: false, message: `\n----------------------------------------\n **${username} was successfully registered!** \n----------------------------------------\n` }
  } catch (err) {
    const message =
      err.errors[0].message == 'email must be unique'
        ? '\n----------------------------------------------\n ** ERROR: This email is already in use  ** \n----------------------------------------------\n'
        : err.errors[0].message ?? 'Something wrong happened'
    return { error: true, message }
  }
}

export const updateEncryptedData = async (username, authToken, encryptedData) => {
  // Create the hashed authentication token
  const hashedAuthToken = createHashedAuthToken(username, authToken)

  try {
    const result = await db['User'].findByPk(hashedAuthToken)
    result.encryptedData = encryptedData
    await result.save()
    // console.log('UPDATE', result)
  } catch (err) {
    // console.log(err)
  }
}

await initialize('password')

// For manual testing
// const username = 'freddi@gmail.com'
// const authToken = 'e38f3254ff1bf6891813abfe30b8d3b467afac74b6621d3c8027d6339337a973'
// const encryptedData =
//   '88fd1bff66470c904295e4e43d9867a277c4d86d1d992a6551dd667eae61992aa40e027721ebb2dd5dcfdddbd7b08a298456e565c734490d570eefda0f3f0c04511091a13fa1f33191a8e41aa808328df849668461348f9eb1e1d62637339d68a9c380639f4bf5d2df61e3509bc2d61d'

// await signUp(username, authToken, encryptedData)

// await signIn(username, authToken)

// await updateEncryptedData(username, authToken, '000000')
