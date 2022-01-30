import { Sequelize } from 'sequelize'

const SecretModel = (sequelizeInstance) => {
  const Secret = sequelizeInstance.define('secret', {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      required: true,
      unique: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
    },
  })

  return Secret
}

export default SecretModel
