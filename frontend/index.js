import readline from 'node:readline'
import { registerUser, getLocalUsers, getUserById, login, getAllBookmarks, addNewBookmark, initSystem } from './bussinessLogic.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('\nStarting application')

const initSystemQuestion = () => {
  rl.question('Insert the database password to start the application: ', async (password) => {
    await initSystem(password)

    return mainMenuQuestion()
  })
}

const mainMenuQuestion = () => {
  rl.question(
    '\n-----------\n MAIN MENU \n-----------\n Enter the menu number:\n 1 - Create an user\n 2 - Access user account\n 3 - Login using Sync\n 4 - Exit the Application\n',
    (option) => {
      console.log(option)
      switch (option) {
        case '1':
          return registerUserQuestion()
        case '2':
          return accessUserAccount()
        case '3':
          return signInQuestions()
        case '4':
          rl.close()
        default:
          console.log('\n-----------------------------------\n Invalid option, please try again! \n-----------------------------------\n')
          return mainMenuQuestion()
      }
    }
  )
}

const signInQuestions = () => {
  rl.question('Enter your email:  ', (email) => {
    if (email.length == 0) {
      console.log('\nPlease fill your email address!\n')
      return signInQuestions()
    }
    rl.question('Enter your password:  ', async (password) => {
      const request = await login(email, password)
      const { error, response } = request
      if (error) {
        console.log(response)
        rl.question('Choose an option:\n1 - Try again\n2 - Main menu\n3 - Exit Application\n', (option) => {
          switch (option) {
            case '1':
              return signInQuestions()
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
        console.log(`\nUser ${response.userEmail} added to local storage! - Select the menu option: Access user account to login into this account\n`)
        mainMenuQuestion()
      }
    })
  })
}

const registerUserQuestion = () => {
  rl.question('Enter your email:  ', (email) => {
    if (email.length == 0) {
      console.log('\nPlease fill your email address!\n')
      return registerUserQuestion()
    }
    rl.question('Enter your password:  ', async (password) => {
      const request = await registerUser(email, password, [])
      const { error, response } = request
      if (error) {
        console.log(response)
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
        console.log(response)
        mainMenuQuestion()
      }
    })
  })
}

const userLoggedQuestion = (id) => {
  return rl.question(
    '\n-----------\n USER MENU \n-----------\n Enter the menu number:\n 1 - Add a new bookmark\n 2 - List your bookmarks\n 3 - Logout\n 4 - Exit the application\n',
    (option) => {
      console.log(option)
      switch (option) {
        case '1':
          return addNewBookmarkQuestion(id)
        case '2':
          const { error, response } = getAllBookmarks(id)

          if (error) {
            console.log(response)
          } else {
            console.log('\n----------------------\n USER BOOKMARKS \n----------------------\n')
            for (const bookmark in response) {
              console.log(`\n${response[bookmark]}\n`)
            }
          }
          return userLoggedQuestion(id)
        case '3':
          console.log(`\n----------------------------------------\n ** Logging Out ** \n----------------------------------------\n`)
          return mainMenuQuestion()
        case '4':
          rl.close()
        default:
          console.log('Invalid option, please try again!')
          return userLoggedQuestion(id)
      }
    }
  )
}

const addNewBookmarkQuestion = (id) => {
  rl.question('Enter the bookmark link: ', async (link) => {
    const { response } = await addNewBookmark(id, { link })

    console.log(response)
    return userLoggedQuestion(id)
  })
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
      return userLoggedQuestion(id)
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

initSystemQuestion()

rl.on('close', function () {
  console.log('Exiting the application')
  process.exit(0)
})
