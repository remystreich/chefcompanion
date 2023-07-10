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
        res.redirect(`/addRecipe/1/${result.id}`)

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
recipeRouter.get('/addRecipe/:step/:recipeId', authguard, async (req, res) => {
    try {
        res.render('templates/addRecipe.twig', {
            step: req.params.step,
            recipeId: req.params.recipeId,
        });
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

//traiter formulaire etape
recipeRouter.post('/addStep/:step/:recipeId', authguard, async (req, res) => {
    try {
        let errors = await recipeController.validateAndCreateStep(req);
        if (errors) {
            throw errors
        }
        if (req.body.action === 'next') {
            nmbstep = parseInt(req.params.step) + 1;
            res.redirect(`/addRecipe/${nmbstep}/${req.params.recipeId}`)
        }
        else {
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(error);
        res.render('templates/addRecipe.twig', {
            errors: error,
            post: req.body,
            step: req.params.step,
            recipeId: req.params.recipeId,
        });
    }
});

module.exports = recipeRouter;