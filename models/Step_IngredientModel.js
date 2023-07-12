const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Step_Ingredient = sequelize.define('Step_Ingredient', {
   
    quantity: {
        type: DataTypes.DECIMAL(10, 2), // 10 est la précision totale et 2 est le nombre de chiffres après la virgule
        allowNull: false,
        validate: {
            isFloat: true, // Valide que la valeur est un nombre décimal
            min: 0, // La valeur doit être supérieure ou égale à 0
        }
    }
}, 
);

module.exports = Step_Ingredient;