import { Sequelize } from 'sequelize'
import * as models from './models/index.js'

console.log('MODELS: ', models)

export const db = {}

export const setupDb = (password) => {
  const sequelize = new Sequelize(null, null, password, {
    dialect: 'sqlite',
    dialectModulePath: '@journeyapps/sqlcipher',
    storage: './src/database.sqlite',
  })

  Object.keys(models).forEach((name) => {
    db[name] = models[name].call(models[name], sequelize)
  })

  db.sequelize = sequelize
}

export const syncDb = async () => {
  await db.sequelize.sync()
}
