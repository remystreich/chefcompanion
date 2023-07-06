const recipeModel = require('../models/RecipeModel');

exports.validateAndCreateRecipe = async (req) => {
    let errors = {};

    if (req.multerError){
        errors.fileError = "Veuillez entrer un fichier valide"
    }
    // Création de l'utilisateur avec Sequelize
    const { title, description, guest_number, category, email } = req.body;
    let user_id = req.session.user.id;
    let photo;
    if (req.file && !req.multerError) {
        photo = req.file.path;
    }
    let status = req.body.status === 'on' ? true : false;

    const newRecipe = await recipeModel.build({
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

    } catch (error) {
        error.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }


    if (Object.keys(errors).length == 0) {
        await newRecipe.save()
        req.idRecipe = newRecipe.id

    } else {
        return errors
    }
};