const recipeModel = require('../models/RecipeModel');

exports.validateAndCreateRecipe = async (req) => {
    let errors = {};

    if (req.multerError){
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
