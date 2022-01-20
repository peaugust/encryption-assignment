const STORAGE = [
  {
    login: '',
    password: '',
    favoriteWebsites: [''],
  },
  {
    login: '',
    password: '',
    favoriteWebsites: [''],
  },
]

export const registerUser = (login, password, favoriteWebsites) => {
  const userLogin = login
  const userPassword = password
  const userFavoriteWebsites = favoriteWebsites

  console.log('userLogin', userLogin)
  console.log('userPassword', userPassword)
  console.log('userFavoriteWebsites', userFavoriteWebsites)
  // send data
}

export const updateLogin = (login) => {
  const newLogin = login

  console.log('newLogin', newLogin)
  // send data
}

export const updateLogin = (password) => {
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
