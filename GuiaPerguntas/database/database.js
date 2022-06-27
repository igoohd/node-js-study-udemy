const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'igormysql', {
  host: 'localhost',
  dialect: 'mysql',
})

module.exports = connection