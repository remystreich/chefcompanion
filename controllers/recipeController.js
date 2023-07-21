const recipeModel = require('../models/RecipeModel');
const stepModel = require('../models/StepModel');
const ingredientModel = require('../models/IngredientModel')
const ingredientController = require('./ingredientController');

exports.validateAndCreateRecipe = async (req) => {
    let errors = {};

    if (req.multerError) {
        errors.fileError = "Veuillez entrer un fichier valide"
    }

    const { title, description, guest_number, category, status: rawStatus } = req.body;
    const user_id = req.session.user.id;
    const photo = (req.file && !req.multerError) ? req.file.path : undefined;
    const status = rawStatus === 'on';

    const newRecipe = recipeModel.build({
        title,
        description,
        guest_number,
        photo,
        category,
        status,
        user_id,
    });

    try {
        await newRecipe.validate();
    } catch (validationError) {
        validationError.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }

    if (Object.keys(errors).length > 0) {
        return { errors, id: null };
    }

    const savedRecipe = await newRecipe.save();
    return { errors: null, id: savedRecipe.id };
};

exports.validateAndCreateStep = async (req) => {
    let errors = { ingredients: [] };
    const { title, details, ingredients, quantity } = req.body;
    const step_number = req.params.step;
    const recipe_id = req.params.recipeId;

    const newStep = stepModel.build({
        title,
        details,
        step_number,
        recipe_id
    });

    try {
        await newStep.validate();
    } catch (validationError) {
        validationError.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }

    // Validate ingredients
    const ingredientObjects = [];
    for (let i = 0; i < ingredients.length; i++) {
        let ingredient = await ingredientModel.findByPk(ingredients[i]);
        if (!ingredient) {
            errors.ingredients[i] = `Cet ingrédient n'existe pas en base.`;
        } else {
            errors.ingredients[i] = null
            ingredientObjects.push({ ingredient, quantity: quantity[i] });
        }
    }

    if (errors.ingredients.some(error => error !== null) || Object.keys(errors).length > 1) {
        return errors;
    } else {
        await newStep.save();
        for (let elem of ingredientObjects) {
            await newStep.addIngredient(elem.ingredient, { through: { quantity: elem.quantity } });
        }
    }
};

exports.getRecipes = async (req) => {
    let page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    const limit = 6
    const offset = (page - 1) * limit;
    const recipes = await recipeModel.findAndCountAll({
        offset: offset,
        limit: limit,
        where: {
            user_id: req.session.user.id //TODO recup recette aimées
        },
    })
    const totalPages = Math.ceil(recipes.count / limit);
    return {
        recipeList: recipes.rows,
        page,
        totalPages
    };
    
}