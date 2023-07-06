const User = require('./UserModel');
const Recipe = require('./RecipeModel');
const Step = require('./StepModel');
const Ingredient = require('./IngredientModel');


//jointures user -> recipe
User.hasMany(Recipe, { as: 'Recipes', foreignKey: 'user_id' });
Recipe.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

//jointures recipe -> steps
Recipe.hasMany(Step, { as: 'Steps', foreignKey: 'recipe_id' });
Step.belongsTo(Recipe, { as: 'Recipe', foreignKey: 'recipe_id' });

//jointures steps -> ingredients
Step.belongsToMany(Ingredient, { through: 'Step_Ingredient' });
Ingredient.belongsToMany(Step, { through: 'Step_Ingredient' });

//jointures user -> ingredients
User.hasMany(Ingredient, { as: 'Ingredients', foreignKey: 'user_id' });
Ingredient.belongsTo(User, { as: 'User', foreignKey: 'user_id' });