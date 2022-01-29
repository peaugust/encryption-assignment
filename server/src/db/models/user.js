import { Sequelize } from 'sequelize'

const UserModel = (sequelizeInstance) => {
  const User = sequelizeInstance.define('user', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      unique: true,
      validate: {
        isEmail: true,
        isU,
      },
    },
    authKey: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      unique: true,
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
