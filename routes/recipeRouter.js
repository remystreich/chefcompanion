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
recipeRouter.get('/dashboard', authguard, async (req, res) => {
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
recipeRouter.post('/addRecipe', authguard, upload.single('photo'), async (req, res) => {
    try {
        let result = await recipeController.validateAndCreateRecipe(req)
        if (result.errors) {
            throw result.errors
        }
        res.redirect(`/addStep/1/${result.id}`)

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
recipeRouter.get('addStep/:step/:recipeId', authguard, async (req, res) => {
    try {
        res.render('templates/addRecipe.twig',{
            step: req.params.step,
            recipeId: req.params.recipeId,
        });
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

recipeRouter.post('addStep/:step/:recipeId', authguard, async (req, res) => {
    try {
        

        nmbstep = parseInt(req.params.step) + 1;
        res.redirect(`addStep/${nmbstep}/${req.params.recipeId}`)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

module.exports = recipeRouter;