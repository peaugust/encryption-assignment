import { Sequelize } from 'sequelize'

const UserModel = (sequelizeInstance) => {
  const User = sequelizeInstance.define('user', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      unique: true,
      validate: {
        isEmail: {
          msg: '\n------------------------------\n ** Invalid email address! ** \n------------------------------\n',
        },
      },
    },
    authKey: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      required: true,
      unique: true,
    },
    encryptedData: {
      type: Sequelize.STRING,
      allowNull: true,
      required: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  })

  return User
}

export default UserModel
