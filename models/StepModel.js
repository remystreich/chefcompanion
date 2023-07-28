const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const recipeModel = require('./RecipeModel')



const StepModel = sequelize.define('Step', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

 

  title: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('title', value.toLowerCase());
    },
    validate: {
      notNull: {
        msg: "Le titre est requis"
      },
      notEmpty: {
        msg: "Le titre est requis"
      },
      len: {
        args: [1, 255],
        msg: "Le titre doit contenir entre 1 et 255 caractères"
      },
      is: {
        args: /^[a-zà-ÿ0-9 ,.'-]+$/i, // n'autorise que les lettres (en minuscules et majuscules), les chiffres, les espaces, les virgules, les points, les apostrophes et les tirets
        msg: "Le titre contient des caractères non valides"
      }
    }
  },

  details: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      is: {
        args: /^[a-zà-ÿ0-9 ,.'-]+$/i, // n'autorise que les lettres (en minuscules et majuscules), les chiffres, les espaces, les virgules, les points, les apostrophes et les tirets
        msg: "La description contient des caractères non valides"
      }
    }
  },

  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        args: true,
        msg: "Le numero d'etape doit être un nombre entier."
      },
      min: {
        args: [1],
        msg: "Le numero d'etape doit être suppérieur à 1."
      },
    },
  },

});


module.exports = StepModel;