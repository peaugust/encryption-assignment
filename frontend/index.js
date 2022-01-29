import { signUp } from '../backend/index.js'
const STORAGE = []

// [] -> 0
// [{...}] -> 1
// [{...}, {...}] -> 2

export const registerUser = async (email, password, favoriteWebsites) => {
  const userEmail = email
  const userPassword = password
  const userFavoriteWebsites = favoriteWebsites
  const userId = STORAGE.length + 1

  const response = await signUp(userEmail, userPassword)

  if (!response.error) STORAGE.push({ userId, userEmail, userPassword, userFavoriteWebsites })

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
