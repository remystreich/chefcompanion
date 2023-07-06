const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./UserModel')



const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  // user_id: {
  //     type: DataTypes.INTEGER,
  //     allowNull: false,

  // },

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

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      is: {
        args: /^[a-zà-ÿ0-9 ,.'-]+$/i, // n'autorise que les lettres (en minuscules et majuscules), les chiffres, les espaces, les virgules, les points, les apostrophes et les tirets
        msg: "La description contient des caractères non valides"
      }
    }
  },

  guest_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        args: true,
        msg: "Le nombre de couverts doit être un nombre entier."
      },
      min: {
        args: [1],
        msg: "Le nombre de couverts doit être au moins 1."
      },
    },
  },

  photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      is: {
        args: /^$|^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$/,
        msg: "Le format de la photo est invalide"
      }
    }
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "La catégorie ne peut pas être vide."
      },
      isIn: {
        args: [["Entrée", "Plat", "Dessert", "Boisson"]],  // Remplacez ceci par votre liste de catégories
        msg: "La catégorie n'est pas valide."
      },
    },
  },

  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Par défaut, le statut sera 'privé' (false)
  },

});

User.hasMany(Recipe, { as: 'Recipes', foreignKey: 'user_id' });
Recipe.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

module.exports = Recipe;