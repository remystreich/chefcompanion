
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./UserModel');
const Recipe = require('./RecipeModel');
const sequelize = require('../database');

const Follow = sequelize.define('Follow', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: User, 
          key: 'id'
        },
        allowNull: false
      },
      recipe_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Recipe, 
          key: 'id'
        },
        allowNull: false
      }
    }, {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'recipe_id']
        }
      ],
      sequelize, 
      modelName: 'Follow',
});

module.exports = Follow;