import readline from 'node:readline'
import {
  registerUser,
  getLocalUsers,
  getUserById,
  // , updateEmail, updatePassword, updateFavoriteWebsites
} from './index.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('\nStarting application')

const mainMenuQuestion = () => {
  rl.question(
    '\n-----------\n MAIN MENU \n-----------\n Enter the menu number:\n 1 - Create an user\n 2 - Access user account\n 3 - Login using Sync\n 4 - Close the Application\n',
    (option) => {
      console.log(option)
      switch (option) {
        case '1':
          return registerUserQuestion()
        case '2':
          return accessUserAccount()
        case '3':
          console.log('TODO: Login with Sync')
          return mainMenuQuestion()
        case '4':
          rl.close()
        default:
          console.log('\n-----------------------------------\n Invalid option, please try again! \n-----------------------------------\n')
          return mainMenuQuestion()
      }
    }
  )
}

const registerUserQuestion = () => {
  rl.question('Enter your email:  ', (email) => {
    rl.question('Enter your password:  ', async (password) => {
      const response = await registerUser(email, password, [])
      const { error, message } = response
      if (error) {
        console.log(message)
        rl.question('Choose an option:\n1 - Try again\n2 - Main menu\n3 - Exit Application\n', (option) => {
          switch (option) {
            case '1':
              return registerUserQuestion()
            case '2':
              return mainMenuQuestion()
            case '3':
              rl.close()
            default:
              console.log('\n------------------------------------------\n** Invalid option - Going to main menu **\n------------------------------------------\n')
              return mainMenuQuestion()
          }
        })
      } else {
        console.log(message)
        mainMenuQuestion()
      }
    })
  })
}

const userLoggedQuestion = (user) => {
  return rl.question(
    '\n-----------\n USER MENU \n-----------\n Enter the menu number:\n 1 - Add a new bookmark\n 2 - List your bookmarks\n 3 - Connect to Sync\n 4 - Logout \n',
    (option) => {
      console.log(option)
      switch (option) {
        case '1':
          console.log('TODO: Add a new bookmark')
          return userLoggedQuestion(user)
        case '2':
          console.log('TODO: List your bookmarks')
          return userLoggedQuestion(user)
        case '3':
          console.log('TODO: Connect to Sync')
          return userLoggedQuestion(user)
        case '4':
          console.log(`\n----------------------------------------\n ** Logging Out ** \n----------------------------------------\n`)
          return mainMenuQuestion()
        default:
          console.log('Invalid option, please try again!')
          return userLoggedQuestion(user)
      }
    }
  )
}

const selectUserQuestion = () => {
  rl.question('Enter the number of the user you want to access: ', (id) => {
    const response = getUserById(id)
    console.log(response)
    if (response.length == 0) {
      console.log(`\n----------------------------------------\nThere isnt a user with this id: ${id} - Try again \n----------------------------------------\n`)
      return selectUserQuestion()
    } else {
      console.log(`\n------------------------------------------\n** Logged on ${response[0].userEmail} account **\n------------------------------------------\n`)
      return userLoggedQuestion(response[0])
    }
  })
}

const accessUserAccount = () => {
  const response = getLocalUsers()
  if (response.length == 0) {
    console.log('\nThere isnt any user logged locally, you can try to: \nLogin on Sync to retrieve its data or create a new user')
    return mainMenuQuestion()
  } else {
    console.log('\n----------\n Users \n----------\n')
    response.map((user) => {
      console.log(user)
    })
    selectUserQuestion()
  }
}

// const editUserQuestion = () => {
//   rl.question('Edit user by id:  ', (userId) => {
//     const selectedUser = 'testing'
//     if (selectedUser === null) {
//       console.log('\n User does not exist! \n')
//       mainMenuQuestion()
//     } else {
//       console.log(`\n Editing user ${user.userId}`)
//       rl.question('Choose an option:\n 1 - Update user email\n 2 - Update user password\n 3 - Update favorite websites\n  4 - Exit\n', (option) => {
//         console.log(option)
//         switch (option) {
//           case '1':
//             return updateEmailQuestion()
//           case '2':
//             return updatePasswordQuestion()
//           case '3':
//             return updateFavoriteWebsitesQuestion()
//           case '4':
//             rl.close()
//           default:
//             console.log('Invalid option, please try again!')
//             return mainMenuQuestion()
//         }
//       })
//     }
//   })
// }

mainMenuQuestion()

rl.on('close', function () {
  console.log('Closing application')
  process.exit(0)
})
