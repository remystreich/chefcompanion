const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const UserModel = require('./UserModel')

const IngredientModel = sequelize.define('Ingredient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'uniqueIngredientPerUser',
        set(value) {
            this.setDataValue('name', value.toLowerCase());
        },
        validate: {
            notNull: {
                msg: "Le nom est requis"
            },
            notEmpty: {
                msg: "Le nom est requis"
            },
            len: {
                args: [1, 255],
                msg: "Le nom doit contenir entre 1 et 255 caractères"
            },
            is: {
                args: /^[a-zà-ÿ0-9 ,.'-]+$/i, // n'autorise que les lettres (en minuscules et majuscules), les chiffres, les espaces, les virgules, les points, les apostrophes et les tirets
                msg: "Le nom contient des caractères non valides"
            }
        }
    },

    type: {
        type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "La catégorie ne peut pas être vide."
      },
      isIn: {
        args: [["legumerie", "boucherie", "poissonnerie", "bof", "economat"]],  // Remplacez ceci par votre liste de catégories
        msg: "La catégorie n'est pas valide."
      },
    },
    },

    unit_mesure: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "L'unité de mesure ne peut pas être vide."
            },
            isIn: {
                args: [["kg", "g", "l", "pce"]],  // Remplacez ceci par votre liste de catégories
                msg: "La catégorie n'est pas valide."
            },
        }
    },

    price: {
        type: DataTypes.DECIMAL(10, 2), // 10 est la précision totale et 2 est le nombre de chiffres après la virgule
        allowNull: false,
        validate: {
            isFloat: true, // Valide que la valeur est un nombre décimal
            min: 0, // La valeur doit être supérieure ou égale à 0
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UserModel, // Ceci est la référence directe au modèle, plutôt qu'au nom de la table
            key: 'id'
        },
        unique: 'uniqueIngredientPerUser',  // Identifiant de la contrainte
    }
});

module.exports = IngredientModel;