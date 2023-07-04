const userRouter = require('express').Router();
const User = require('../models/UserModel');
const authguard = require("../services/authguard");
const userController = require('../controllers/userController');
const upload = require('../services/multer')

userRouter.get('/register', async (req, res) => {
    try {
        res.render('templates/register.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

userRouter.post('/register', upload.single('photo'), async (req, res) => {
    const { name, firstname, email, password } = req.body;
    try {
        let errors = await userController.validateAndCreateUser(req)
        if (errors) {
            throw errors
        }


        res.redirect('/login')
    } catch (error) {
        console.log(error);
        res.render('templates/register.twig',{
            errors: error,
            post: req.body
        }

        )
    }
});



module.exports = userRouter

