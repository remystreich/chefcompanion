const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Step_Ingredient = sequelize.define('Step_Ingredient', {
   
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, );

module.exports = Step_Ingredient;