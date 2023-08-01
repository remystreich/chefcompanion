const recipeRouter = require('express').Router();
const authguard = require("../services/authguard");
const recipeController = require('../controllers/recipeController');
const ingredientController = require('../controllers/ingredientController')

const upload = require('../services/multer');
const fs = require('fs');
const path = require('path');

//landingPage TODO
recipeRouter.get('/', async (req, res) => {
    try {
        const recipesAutocompleter =  await recipeController.recipesForAutocomplete(req)
        res.render('templates/landing.twig', {
            user: req.session.user,
            recipesAutocompleter
        })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
});

//affichage dashboard TODO
recipeRouter.get('/dashboard', authguard, async (req, res) => {
    try {
        const recipesAutocompleter =  await recipeController.recipesForAutocomplete(req)
        res.render('templates/dashboard.twig',{
            recipesAutocompleter
        })
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
        const ingredients = await ingredientController.findAndSortIngredient(req);
        res.render('templates/addRecipe.twig', {
            stepNmbr: req.params.step,
            recipeId: req.params.recipeId,
            ingredients,
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
        const ingredients = await ingredientController.findAndSortIngredient(req);
        res.render('templates/addRecipe.twig', {
            errors: error,
            post: req.body,
            stepNmbr: req.params.step,
            recipeId: req.params.recipeId,
            ingredients,
            nmbrInputs: req.body.ingredients.length
        });
    }
});

//affichage liste des recettes
recipeRouter.get('/recipeList', authguard, async (req, res) => {
    try {
        const recipesAutocompleter =  await recipeController.recipesForAutocomplete(req)
        const { recipeList, page, totalPages } = await recipeController.getRecipes(req);
       
        res.render('templates/recipeList.twig', {
            recipeList,
            page,
            totalPages,
            recipesAutocompleter
        })

    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//affichage détails une fiche
recipeRouter.get('/recipeDetails/:id', async (req, res) => {
    try {
        const recipesAutocompleter =  await recipeController.recipesForAutocomplete(req)
        const {recipe, author, stepCount, ingredientSteps} = await recipeController.getRecipe(req);
        res.render('templates/recipeDetails.twig',{
            recipe,
            author,
            steps: recipe.Steps,
            stepCount,
            ingredientSteps,
            user: req.session.user,
            recipesAutocompleter
        })

    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//supprimer une fiche
recipeRouter.get('/deleteRecipe/:id', authguard, async (req, res) => {
    try {
        const error = await recipeController.deleteRecipe(req)
        if (error) {
            throw new Error(error)
        }
        res.redirect('/recipeList')
    } catch (error) {
        console.log(error);
        req.session.error = error.message
        res.redirect('back')
    }
})

//update fiche display
recipeRouter.get('/updateRecipe/:id', authguard, async (req,res) => {
    try {
        const {recipe} = await recipeController.getRecipe(req)
        res.render('templates/updateRecipe.twig',{
            recipe: recipe
        })
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})

//traiter update fiche
recipeRouter.post('/updateRecipe/:id', authguard, upload.single('photo'), async (req,res) => {
    try {
        const result = await recipeController.updateRecipe(req);
        if (result.errors) {
            throw result.errors
        }
        res.redirect(`/recipeDetails/${req.params.id}`)
    } catch (error) {
        console.log(error);
        if (req.file) {
            fs.unlink(path.join(req.file.path), err => {
                if (err) console.error( err);
            });
        }
        res.render('templates/updateRecipe.twig', {
            errors: error,
            post: req.body
        });
    }
})

//update step display
recipeRouter.get('/updateStep/:id', authguard, async(req,res) => {
    try {
        const ingredients = await ingredientController.findAndSortIngredient(req);
        const step = await recipeController.getStep(req)
        if(step.error){
            console.log(step.error);
            throw step.error
        }
        res.render('templates/updateRecipe.twig',{
            step,
            ingredients,
            ingredientStep: JSON.stringify(step.Ingredients)
            
        })
    } catch (error) {
        console.log(error);
        res.json({error: error.message})
    }
})

//traiter update step
recipeRouter.post('/updateStep/:id', authguard, async(req,res) =>{
    try {
        let errors = await recipeController.updateStep(req);
        if (errors) {
            throw errors
        }
        const step = await recipeController.getStep(req)
        res.redirect(`/recipeDetails/${step.recipe_id}`)
    } catch (error) {
        console.log(error);
        const ingredients = await ingredientController.findAndSortIngredient(req);
        res.render('templates/updateRecipe.twig', {
            errors: error,
            post: req.body,
            stepNmbr: req.params.step,
            recipeId: req.params.recipeId,
            ingredients,
            nmbrInputs: req.body.ingredients.length
        });
    }
})

//delete step
recipeRouter.get('/deleteStep/:id', authguard, async(req,res) => {
    try {
        await recipeController.deleteStep(req)
        
        res.redirect('back')

    } catch (error) {
        console.log(error);
        req.session.error = error.message
        res.redirect('back')
    }
})

//changer ordre etape
recipeRouter.put('/updateRecipes', authguard, async(req, res) => {
    try {
        await recipeController.updateRecipesOrder(req);
        res.send('Modification réussie')
    } catch (error) {
        console.log(error);
        res.status(500).json({error}); 
    }
});

//ajouter une nouvelle etape 
recipeRouter.get('/addNewStep/:stepLength/:recipeId',authguard, async(req, res) => {
    try {
        const ingredients = await ingredientController.findAndSortIngredient(req);
        let stepLength =  parseInt(req.params.stepLength)+1
        res.render('templates/updateRecipe.twig', {
            ingredients,
            stepLength,
            recipeId:req.params.recipeId

        });
    } catch (error) {
        console.log(error);
        res.json({error: error.message})
    }
})


//rechercher recette
recipeRouter.get('/searchRecipe', authguard, async(req,res)=>{
    try {
        const { recipeList, page, totalPages } = await recipeController.searchRecipe(req);
        res.render('templates/recipeList.twig', {
            recipeList,
            page,
            totalPages
        })

    } catch (error) {
        console.log(error);
        res.json({error: error.message})
    }

});



module.exports = recipeRouter;