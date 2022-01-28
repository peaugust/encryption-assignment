import readline from 'node:readline'
import {
  registerUser, getLocalUsers
  // , updateEmail, updatePassword, updateFavoriteWebsites
} from './index.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('Starting application')

const mainMenuQuestion = () => {
  rl.question('Choose an option:\n 1 - Create an user\n 2 - List all users\n 3 - Exit\n', (option) => {
    console.log(option)
    switch (option) {
      case '1':
        return registerUserQuestion()
      case '2':
        return listUsers()
      case '3':
        rl.close()
      default:
        console.log('Invalid option, please try again!')
        return mainMenuQuestion()
    }
  })
}

const registerUserQuestion = () => {
  rl.question('Enter your email:  ', (email) => {
    rl.question('Enter your password:  ', (password) => {
      console.log(email, password)
      if (registerUser(email, password, [])) {
        console.log('\n User successfully registered!')
        mainMenuQuestion()
      } else {
        console.log('\n User register failed! \n')
        rl.question('Choose an option:\n1 - Try again\n2 - Main menu\n3 - Exit\n', (option) => {
          switch (option) {
            case '1':
              return registerUserQuestion()
            case '2':
              return mainMenuQuestion()
            case '3':
              rl.close()
            default:
              console.log('Invalid option')
              return mainMenuQuestion()
          }
        })
      }
    })
  })
}

const listUsers = () => {
  console.log(getLocalUsers())
  // rl.question('Choose an option:\n 1 - Edit an user\n 2 - Exit\n', (option) => {
  //   console.log(option)
  //   switch (option) {
  //     case '1':
  //       return editUserQuestion()
  //     case '2':
  //       rl.close()
  //     default:
  //       console.log('Invalid option, please try again!')
  //       return mainMenuQuestion()
  //   }
  // })
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
  console.log('\Closing application')
  process.exit(0)
})
