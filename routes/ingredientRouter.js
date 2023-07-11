const ingredientRouter = require('express').Router();
const authguard = require("../services/authguard");
const ingredientController = require('../controllers/ingredientController');

//ajout de recette
ingredientRouter.post('/addIngredient', authguard,  async (req, res) => {
    try {
        
        let result = await ingredientController.validateAndCreateIngredient(req)
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

module.exports = ingredientRouter;