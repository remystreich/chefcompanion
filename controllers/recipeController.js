const recipeModel = require('../models/RecipeModel');
const stepModel = require('../models/StepModel');
const ingredientModel = require('../models/IngredientModel')
const userModel = require('../models/UserModel')
const followModel =  require('../models/FollowsModel')
const ingredientController = require('./ingredientController');
const fs = require('fs');
const { Sequelize, Op } = require('sequelize');

//verif isOwner?
const isOwner = async (req) => {
    const recipe = await recipeModel.findOne({ where: { id: req.params.id, user_id: req.session.userId } });
    if (!recipe) {
        throw new Error('Vous devez être le propriétaire pour apporter des modifications');
    }
    return recipe;
};

const isOwnerStep = async (req, id) => {
    const step = await stepModel.findOne({
        where: { id: id },
        include: {
            model: recipeModel,
            as: 'Recipe', // utilisez l'alias que vous avez défini lors de la création de l'association

        }
    });
    // Vérifie si l'étape a été trouvée et si l'utilisateur est le propriétaire de l'étape
    if (!step || step.Recipe.user_id !== req.session.userId) {
        throw new Error('Vous devez être le propriétaire pour apporter des modifications');
    }
    return step;
};



//créer fiche
exports.validateAndCreateRecipe = async (req) => {
    let errors = {};

    if (req.multerError) {
        errors.fileError = "Veuillez entrer un fichier valide"
    }

    const { title, description, guest_number, category, status: rawStatus } = req.body;
    const user_id = req.session.user.id;
    const photo = (req.file && !req.multerError) ? req.file.filename : undefined;
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

//créer étapes
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
    if (ingredients) {
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = await ingredientModel.findByPk(ingredients[i]);
            if (!ingredient) {
                errors.ingredients[i] = `Cet ingrédient n'existe pas en base.`;
            } else {
                errors.ingredients[i] = null
                ingredientObjects.push({ ingredient, quantity: quantity[i] });
            }
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

//recuperer liste fiches
exports.getRecipes = async (req) => {
    try {
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

    } catch (error) {
        throw error
    }


}

//récupérer UNE fiche
exports.getRecipe = async (req) => {
    try {
        const recipe = await recipeModel.findByPk(req.params.id, {
            subQuery: false,
            include: [{
                model: stepModel,
                as: 'Steps',
                include: [{
                    model: ingredientModel,
                    as: 'Ingredients',
                    through: { attributes: ['quantity'] }
                }]
            }],
            order: [[{ model: stepModel, as: 'Steps' }, 'step_number', 'ASC']],
        });

        const allSteps = recipe.Steps;
        let allIngredients = allSteps.flatMap(step => step.Ingredients);

        let uniqueIngredients = Object.values(allIngredients.reduce((result, ingredient) => {
            result[ingredient.id] = ingredient;
            return result;
        }, {}));
        // TODO:groupBy sequelize

        // Construire la structure de données
        let ingredientSteps = uniqueIngredients.map(ingredient => {
            let steps = allSteps.map(step => {
                let ingredientInStep = step.Ingredients.find(i => i.id === ingredient.id);
                return ingredientInStep ? ingredientInStep.Step_Ingredient.quantity : 0;
            });
            return {
                ingredient: ingredient.name,
                price: ingredient.price,
                unit_mesure: ingredient.unit_mesure,
                steps: steps
            };
        });

        const user = await userModel.findByPk(req.session.user.id);
        const isFollowed = await user.hasFollowedRecipe(recipe);
        const followsCount = await recipe.countFollowers();
        const author = await userModel.findByPk(recipe.user_id);
        const stepCount = await stepModel.count({ where: { recipe_id: req.params.id } });

        return { recipe, author, stepCount, ingredientSteps, isFollowed, followsCount };
    } catch (error) {
        console.log(error);
    }
};

//supprimer fiche
exports.deleteRecipe = async (req) => {
    try {
        const recipe = await isOwner(req);
        if (recipe.photo) {
            // Supprimer le fichier d'image
            fs.unlink(`assets/uploads/${recipe.photo}`, err => {
                if (err) console.error(err);
            });
        }

        await recipe.destroy()
    } catch (error) {
        return error
    }
}

//update fiche
exports.updateRecipe = async (req) => {
    let updateRecipe = await await isOwner(req);
    let errors = {};

    if (req.multerError) {
        errors.fileError = "Veuillez entrer un fichier valide"
    }

    const { title, description, guest_number, category, status: rawStatus } = req.body;
    const status = rawStatus === 'on';

    updateRecipe.title = title;
    updateRecipe.description = description;
    updateRecipe.guest_number = guest_number;
    updateRecipe.category = category;
    updateRecipe.status = status;

    if (req.file && !req.multerError) {
        if (updateRecipe.photo) {
            // Supprimer le fichier d'image
            fs.unlink(`assets/uploads/${updateRecipe.photo}`, err => {
                if (err) console.error(err);
            });
        }
        updateRecipe.photo = req.file.filename;
    }

    try {
        await updateRecipe.validate();
    } catch (validationError) {
        validationError.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }
    await updateRecipe.save();
}


//update Step
exports.updateStep = async (req) => {
    let updateStep = await isOwnerStep(req, req.params.id);
    let errors = { ingredients: [] };
    const { title, details, ingredients, quantity } = req.body;


    updateStep.title = title;
    updateStep.details = details;

    try {
        await updateStep.validate();
    } catch (validationError) {
        validationError.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }

    // Validate ingredients
    await updateStep.removeIngredients(await updateStep.getIngredients());
    const ingredientObjects = [];
    if (ingredients) {
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = await ingredientModel.findByPk(ingredients[i]);
            if (!ingredient) {
                errors.ingredients[i] = `Cet ingrédient n'existe pas en base.`;
            } else {
                errors.ingredients[i] = null
                ingredientObjects.push({ ingredient, quantity: quantity[i] });
            }
        }
    }
    if (errors.ingredients.some(error => error !== null) || Object.keys(errors).length > 1) {
        return errors;
    } else {
        await updateStep.save();
        for (let elem of ingredientObjects) {
            await updateStep.addIngredient(elem.ingredient, { through: { quantity: elem.quantity } });
        }
    }
}

//recuperer une etape
exports.getStep = async (req) => {
    try {
        await isOwnerStep(req, req.params.id);
        const step = await stepModel.findByPk(req.params.id, {
            include: [{
                model: ingredientModel,
                as: 'Ingredients',
                through: { attributes: ['quantity'] }
            }]
        });
        return step
    } catch (error) {
        console.log(error);
        return { error: error }
    }
}

//effacer une etape
exports.deleteStep = async (req) => {
    try {
        const step = await isOwnerStep(req, req.params.id);
        let recipeId = step.Recipe.id;
        let stepNumber = step.step_number;

        await step.destroy()
        await stepModel.update({
            step_number: Sequelize.literal('step_number - 1')
        }, {
            where: {
                recipe_id: recipeId,
                step_number: {
                    [Sequelize.Op.gt]: stepNumber
                }
            }
        })
    } catch (error) {
        throw error
    }
}

exports.updateRecipesOrder = async (req) => {
    try {
        const newOrder = req.body;
        //vérifier si les etapes appartiennent bien à l'user, promise effectue toutes les veriffiaction en paralele
        const ids = Object.keys(newOrder);
        await Promise.all(ids.map(id => isOwnerStep(req, id)));

        console.log(newOrder);
        const promises = ids.map(async (id) => {
            const step_number = newOrder[id];
            return await stepModel.update({ step_number }, { where: { id } });
        });

        // Wait for all updates to finish
        await Promise.all(promises);

    } catch (error) {
        throw error
    }
}

//retourner résultat de recherche
exports.searchRecipe = async (req) => {
    try {
        let page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
        const limit = 6
        const offset = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const recipes = await recipeModel.findAndCountAll({
            offset: offset,
            limit: limit,
            where: {
                [Op.or]: [
                    { user_id: req.session.user.id },
                    { status: true }
                ],
                [Op.or]: [
                    { title: { [Op.like]: '%' + searchQuery + '%' } },
                    { description: { [Op.like]: '%' + searchQuery + '%' } },
                ]
            }
        })

        const totalPages = Math.ceil(recipes.count / limit);

        return {
            recipeList: recipes.rows,
            page,
            totalPages
        };
    } catch (error) {
        throw error
    }
}

//retourner la liste de recette apparaissant dans l'autocomplete
exports.recipesForAutocomplete = async (req) => {
    try {
        const userId = req.session && req.session.user ? req.session.user.id : null;
        let condition;

        if(userId) {
            condition = {
                [Op.or]: [
                    { user_id: userId },
                    { status: true }
                ],
            };
        } else {
            condition = { status: true };
        }

        const recipes = await recipeModel.findAll({
            where: condition
        })

        return recipes;

    } catch (error) {
        throw error;
    }
}

//ajouter un like
exports.addFollow = async (req) => {
    try {
        const user = await userModel.findByPk(req.session.user.id);
        const recipe = await recipeModel.findByPk(req.params.id);

        const existingFollow = await followModel.findOne({ where: { user_id: user.id, recipe_id: recipe.id } });
        if (existingFollow) {
            throw new Error('Vous suivez déjà cette recette');
        }
        await user.addFollowedRecipe(recipe);
        return true
        
    } catch (error) {
        throw error
    }
}

//supprimer like
exports.removeFollow = async (req) => {
    try {
        const user = await userModel.findByPk(req.session.user.id);
        const recipe = await recipeModel.findByPk(req.params.id);
        await user.removeFollowedRecipe(recipe);
        return true;
    } catch (error) {
        throw error;
    }
};
