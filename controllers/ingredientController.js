const ingredientModel = require('../models/IngredientModel');
const stepIngredientModel = require('../models/Step_IngredientModel'); //
const { Sequelize } = require('sequelize'); // Make sure to import Sequelize

//verif isOwner?
const isOwner = async (req) => {
    const ingredient = await ingredientModel.findOne({ where: { id: req.params.id, user_id: req.session.userId } });
    if (!ingredient) {
        throw new Error('Vous devez être le propriétaire pour apporter des modifications');
    }
};


//creation ingrédients
exports.validateAndCreateIngredient = async (req) => {
    let errors = {};

    const { name, type, unit_mesure, price } = req.body;
    const user_id = req.session.user.id;

    try {
        const newIngredient = await ingredientModel.create({
            name,
            type,
            unit_mesure,
            price,
            user_id,
        });
        return {
            id: newIngredient.id,
            name: newIngredient.name,
        };
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            //créer un tableau d'erreur
            error.errors.forEach((err) => {
                errors[err.path] = err.message;
            });
            return { errors, id: null };
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            errors['name'] = 'Un ingrédient avec ce nom existe déjà.';
            throw errors;
        }
        throw error;
    }
};

//retourner liste d'ingrédients triés par catégorie
exports.findAndSortIngredient = async (req) => {
    const userId = req.session.user.id;
    const ingredients = await ingredientModel.findAll({
        where: {
            user_id: userId
        },
        order: [['type', 'ASC']]
    });

    // Organiser les ingrédients par catégorie
    const categories = {};
    for (const ingredient of ingredients) {
        const categoryName = ingredient.type;
        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }
        categories[categoryName].push(ingredient);
    }
    return categories;
}

//supprimer un ingrédient
exports.deleteIngredient = async (req) => {
    try {
        await isOwner(req);
        const ingredientId = req.params.id;

        //vérifier si l'ingrédient est utilisé dans une recette
        const usedIngredient = await stepIngredientModel.findOne({
            where: { ingredientId }
        })
        if (usedIngredient) {
            throw new Error('Cet ingrédient est utilisé dans au moins une fiche technique et ne peut pas etre supprimé')
        }
        //si pas utilisé on le supprime
        const ingredient = await ingredientModel.findByPk(ingredientId);
        await ingredient.destroy();
    } catch (error) {
        return error
    }
}


//update ingrédient
exports.validateAndUpdateIngredient = async (req) => {
    try {
        await isOwner(req);

        const { name, type, unit_mesure, price } = req.body;
        const { id } = req.params;


        await ingredientModel.update({
            name,
            type,
            unit_mesure,
            price
        }, {
            where: { id }
        });

    } catch (error) {
        const errors = {};
        error.errors.forEach((err) => {
            if (err.validatorKey === 'not_unique') {
                errors['name'] = 'Un ingrédient avec ce nom existe déjà.';
            } else {
                errors[err.path] = err.message;
            }
        });
        throw errors;
    }
};