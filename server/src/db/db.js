import { Sequelize } from 'sequelize'
import * as models from './models/index.js'

console.log('MODELS: ', models)
const sequelize = new Sequelize(null, null, 'password', {
  dialect: 'sqlite',
  dialectModulePath: '@journeyapps/sqlcipher',
  storage: './src/database.sqlite',
})

export const db = {}

Object.keys(models).forEach((name) => {
  db[name] = models[name].call(models[name], sequelize)
})

db.sequelize = sequelize

export const setupDb = async () => {
  db.sequelize.sync()
}
