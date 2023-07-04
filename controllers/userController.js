const user = require('../models/UserModel');
const bcrypt = require('bcrypt');

exports.preValidateUser = async (req) => {
    let errors = {}
    const findedUser = await user.findOne({ where: { email: req.body.email } })
    if (req.body.password !== req.body.confirmPassword) {
        errors.confirmPassword = "les mots de passe doivent etre identique";
    }
    if (findedUser) {
        errors.mailSign = "Cette adresse mail est deja utilisé"
    }
    if (req.multerError){
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
          let photo;
          if (req.file && !req.multerError){
               photo = req.file.path;
          }
  
          const newUser = await user.build({
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