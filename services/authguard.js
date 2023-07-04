const UserModel = require('../models/UserModel');

let authguard = async(req,res,next) =>{
    let user = await UserModel.findByPk(req.session.userId)
    if(user){
        req.session.owner = true
        res.locals.user = user;
        req.session.user = user
        next()
    }else{
        req.session.owner = false
        console.log('Vous n\'êtes pas authentifié.');
        res.redirect('/login')
    }

}

module.exports = authguard