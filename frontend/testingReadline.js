import readline from 'readline'
import { registerUser, getLocalUsers } from './index.js'

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
  return mainMenuQuestion()
}

mainMenuQuestion()

rl.on('close', function () {
  console.log('\nBYE BYE !!!')
  process.exit(0)
})
