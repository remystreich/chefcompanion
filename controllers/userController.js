const userModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

//vérifications en dehors des validators du model
exports.preValidateUser = async (req) => {
    let errors = {}

    const user = await userModel.findOne({ where: { email: req.body.email } })
    if (user) {
        errors.mailSign = "Cette adresse mail est deja utilisé"
    }

    if (req.body.password !== req.body.confirmPassword) {
        errors.confirmPassword = "les mots de passe doivent etre identique";
    }

    if (req.multerError) {
        errors.fileError = "Veuillez entrer un fichier valide"
    }

    let result = (Object.keys(errors).length == 0) ? null : errors
    return result
};

exports.validateAndCreateUser = async (req) => {
    let errors = {};
    let prevalidateError = await this.preValidateUser(req);
    if (prevalidateError) {
        errors = { ...errors, ...prevalidateError };
    }
    // Création de l'utilisateur avec Sequelize
    const { name, firstname, email, password } = req.body;
    const photo = (req.file && !req.multerError) ? req.file.filename : undefined;

    const newUser = await userModel.build({
        name,
        firstname,
        email,
        password,
        photo,

        // Autres attributs de l'utilisateur
    });
    try {
        await newUser.validate();

    } catch (error) {
        error.errors.forEach((err) => {
            errors[err.path] = err.message;
        });
    }


    if (Object.keys(errors).length == 0) {
        await newUser.save()

    } else {
        return errors
    }
};

exports.login = async (req) => {
    const user = await userModel.findOne({ where: { email: req.body.email } })
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.userId = user.id
        }
        else {
            throw { password: "Mot de passe incorrect" }
        }
    }
    else {
        throw { email: "Adresse email inconnue" }
    }
};