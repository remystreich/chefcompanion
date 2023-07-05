const UserModel = require('../models/UserModel');

let authguard = async(req,res,next) =>{
    let user = await UserModel.findByPk(req.session.userId)
    if(user){
        let userObject = user.toJSON();
        delete userObject.password; // Supprime le mot de passe du document.
        res.locals.user = userObject;
        next()
    }else{
        console.log('Vous n\'êtes pas authentifié.');
        res.redirect('/login')
    }

}

module.exports = authguard