const recipeRouter = require('express').Router();
const authguard = require("../services/authguard");
const recipeController = require('../controllers/recipeController');
const upload = require('../services/multer');
const fs = require('fs');
const path = require('path');

//landingPage
recipeRouter.get('/', async (req, res) => {
    try {
        res.render('templates/landing.twig', {
            user: req.session.user
        })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

//affichage dashboard
recipeRouter.get('/dashboard',authguard, async (req, res) => {
    try {
        res.render('templates/dashboard.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

//affichage ajout de recettes
recipeRouter.get('/addRecipe', authguard, async (req, res) => {
    try {
        res.render('templates/addRecipe.twig')
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

//ajout de recette
recipeRouter.post('/addRecipe', authguard, upload.single('photo'),  async (req, res) => {
    try {
       
        let errors = await recipeController.validateAndCreateRecipe(req)
        if (errors) {
            throw errors
        }
        res.redirect('/addStep/1/'+req.idRecipe)

    } catch (error) {
        console.log(error);
        if (req.file) {
            fs.unlink(path.join(req.file.path), err => {
                if (err) console.error("Error deleting file:", err);
            });
        }
        res.render('templates/addRecipe.twig', {
            errors: error,
            post: req.body
        });
    }
});

//affichage form d'étape
recipeRouter.get('addStep/:step/:recipeId', authguard, async (req, res) =>{
    try {
        res.render('templates/addRecipe.twig',{
            RecipeId: ecz,
        });
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

recipeRouter.post('addStep/:step/:recipe', authguard, async (req, res) =>{
    try {
       //ton bordel

       nmbstep = parseInt(req.params.step) + 1
       res.redirect(`addStep/${nmbstep}`)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

module.exports = recipeRouter;