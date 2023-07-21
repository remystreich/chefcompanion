const ingredientRouter = require('express').Router();
const authguard = require("../services/authguard");
const ingredientController = require('../controllers/ingredientController');
const { json } = require('sequelize');
const IngredientModel = require('../models/IngredientModel');

//ajout d'ingredient
ingredientRouter.post('/addIngredient', authguard,  async (req, res) => {
    try {
        let result = await ingredientController.validateAndCreateIngredient(req)
        console.log(result);
        if (result.errors) {
            throw result.errors
        }
        res.json({ 
            message: "Ingredient ajouté avec succès.",
            name: result.name,
            id: result.id,
            type: result.type,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({error});    
    }
});


//afficher liste ingredients
ingredientRouter.get('/ingredientsDisplay/:cat?', authguard, async (req, res) =>{
    try {
        const ingredients = await ingredientController.findAndSortIngredient(req);
        let errorMessage = req.session.error
        req.session.error = null

        res.render('templates/ingredientsDisplay.twig', {
            categories: Object.keys(ingredients),
            action: req.params.cat,
            ingredients: ingredients[req.params.cat],
            errorMessage: errorMessage
        })

    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//supprimer ingredients
ingredientRouter.get('/deleteIngredient/:id', authguard, async (req,res)=> {
    try {
        const error = await ingredientController.deleteIngredient(req)
        if (error) {
            throw new Error(error)
        }
       
        res.redirect('back')
    } catch (error) {
        console.log(error);
        req.session.error = error.message
        res.redirect('back')
    }
})

//modifier un ingrédient
ingredientRouter.put('/updateIngredient/:id' , authguard, async (req,res)=>{
   
    try {
        let errors = await ingredientController.validateAndUpdateIngredient(req)
        if (errors) {
            throw errors
        }                              
        res.send('Modification réussie')
    } catch (error) {
        console.log(error)
        res.status(500).json({error}); 
    }
})

module.exports = ingredientRouter;