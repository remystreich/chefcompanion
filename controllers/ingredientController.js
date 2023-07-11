const ingredientModel = require('../models/IngredientModel');
const { Sequelize } = require('sequelize'); // Make sure to import Sequelize


exports.validateAndCreateIngredient = async (req) => {
    let errors = {};

    const { name, type, unit_mesure, price } = req.body;
    const user_id = req.session.user.id;

    const newIngredient = ingredientModel.build({
        name,
        type,
        unit_mesure,
        price,
        user_id,
    });

    try {
        await newIngredient.validate();
    } catch (validationError) {
        validationError.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }

    if (Object.keys(errors).length > 0) {
        return { errors, id: null };
    }

    try {
        const savedIngredient = await newIngredient.save();
        return {
            errors: null,
            id: savedIngredient.id,
            name : savedIngredient.name,
        };
    } catch (saveError) {
        if (saveError instanceof Sequelize.UniqueConstraintError) {
            errors['name'] = 'Un ingrédient avec ce nom existe déjà.';
            return { errors, id: null };
        } else {
            throw saveError; // re-throw the error if it's not a UniqueConstraintError
        }
    }
};

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