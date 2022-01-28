const STORAGE = []

export const registerUser = (email, password, favoriteWebsites) => {
  const userEmail = email
  const userPassword = password
  const userFavoriteWebsites = favoriteWebsites
  const userId = STORAGE.length + 1

  console.log('email', userEmail)
  console.log('userPassword', userPassword)
  console.log('userFavoriteWebsites', userFavoriteWebsites)

  STORAGE.push({ userId, userEmail, userPassword, userFavoriteWebsites })
  // TODO: send data

  return true
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
