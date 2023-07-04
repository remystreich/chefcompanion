const userRouter = require('express').Router();
const User = require('../models/UserModel');
const authguard = require("../services/authguard");
const userController = require('../controllers/userController');
const upload = require('../services/multer');
const fs = require('fs');
const path = require('path');

userRouter.get('/register', async (req, res) => {
    try {
        res.render('templates/register.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

userRouter.post('/register', upload.single('photo'), async (req, res) => {
  
    try {
        let errors = await userController.validateAndCreateUser(req)
        if (errors) {
            throw errors
        }
        res.redirect('/login')
    } catch (error) {
        console.log(error);
        if (req.file) {
            fs.unlink(path.join( req.file.path), err => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        res.render('templates/register.twig',{
            errors: error,
            post: req.body
        }

        )
    }
});



module.exports = userRouter

