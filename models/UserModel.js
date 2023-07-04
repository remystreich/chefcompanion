const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('name', value.toLowerCase());
          },
        validate: {
            notNull: {
                msg: "Le nom est requis"
            },
            notEmpty: {
                msg: "Le nom ne peut pas être vide"
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

    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('firstname', value.toLowerCase());
          },
        validate: {
            notNull: {
                msg: "Le prénom est requis"
            },
            notEmpty: {
                msg: "Le prénom ne peut pas être vide"
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

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "L'adresse email est requise"
            },
            notEmpty: {
                msg: "L'adresse email ne peut pas être vide"
            },
            len: {
                args: [1, 255],
                msg: "L'email doit contenir entre 1 et 255 caractères"
            },
            is: {
                args: /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, // n'autorise que les lettres (en minuscules et majuscules), les chiffres, les espaces, les virgules, les points, les apostrophes et les tirets
                msg: "L'email contient des caractères non valides"
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le mot de passe est requise"
            },
            notEmpty: {
                msg: "Le mot de passe ne peut pas être vide"
            },
            len: {
                args: [8, 255],
                msg: "Le mot de passe doit contenir entre 8 et 255 caractères"
            },
            is: {
                args: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/i, // n'autorise que les lettres (en minuscules et majuscules), les chiffres, les espaces, les virgules, les points, les apostrophes et les tirets
                msg: "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre et contenir au moins 8 caractères."
            }
        }
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
    }
},
    {
        hooks: {
            beforeSave: async (user) => {
                if (user.changed('password')) {
                    const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT));
                    user.password = hashedPassword;
                }
            }
        }

    });

module.exports = User;