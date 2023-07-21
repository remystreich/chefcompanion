const IngredientModel = require('../models/IngredientModel');
const ingredientModel = require('../models/IngredientModel');
const stepIngredientModel = require('../models/Step_IngredientModel'); //
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
            name: savedIngredient.name,
        };
    } catch (saveError) {
        errors['name'] = 'Un ingrédient avec ce nom existe déjà.';
        throw errors;
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

exports.deleteIngredient = async (req) => {
    try {
        const ingredientId = req.params.id;
        const usedIngredient = await stepIngredientModel.findOne({
            where: { ingredientId }
        })

        if (usedIngredient) {
            throw new Error('Cet ingrédient est utilisé dans au moins une fiche technique et ne peut pas etre supprimé')
        }

        const ingredient = await IngredientModel.findByPk(ingredientId);
        await ingredient.destroy();
    } catch (error) {
        return error
    }
}

exports.validateAndUpdateIngredient = async (req) => {
    let errors = {};
    
    const { name, type, unit_mesure, price } = req.body;

    let updateIngredient = await IngredientModel.findByPk(req.params.id);
    updateIngredient.name = name;
    updateIngredient.type = type;
    updateIngredient.unit_mesure = unit_mesure;
    updateIngredient.price = price;

    try {
    await updateIngredient.validate();
    
    } catch (validationError) {
        validationError.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    try {
        await updateIngredient.save();
    } catch (saveError) {
        if (saveError instanceof Sequelize.UniqueConstraintError) {
            return { name: 'Un ingrédient avec ce nom existe déjà.' };
        }
        throw saveError; 
    }

}