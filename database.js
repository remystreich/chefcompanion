const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: 8889,
  dialect: 'mysql'
});

module.exports = sequelize;


require('./models/UserModel');
require('./models/RecipeModel');
require('./models/StepModel');
require('./models/jointures')
require('./models/IngredientModel');
require('./models/Step_IngredientModel');
require('./models/FollowsModel');

sequelize.sync({ force: false })
.then(() => {
  console.log('Tables synchronisées avec la base de données.');
})
.catch((error) => {
  console.error('Erreur lors de la synchronisation des tables :', error);
});