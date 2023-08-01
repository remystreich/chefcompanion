const User = require('./UserModel');
const Recipe = require('./RecipeModel');
const Step = require('./StepModel');
const Ingredient = require('./IngredientModel');
const Step_Ingredient = require('./Step_IngredientModel')
const Follow = require('./FollowsModel')


//jointures user -> recipe
User.hasMany(Recipe, { as: 'Recipes', foreignKey: 'user_id' });
Recipe.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

//jointures recipe -> steps
Recipe.hasMany(Step, { as: 'Steps', foreignKey: 'recipe_id' });
Step.belongsTo(Recipe, { as: 'Recipe', foreignKey: 'recipe_id' });

//jointures user -> ingredients
User.hasMany(Ingredient, { as: 'Ingredients', foreignKey: 'user_id' });
Ingredient.belongsTo(User, { as: 'User', foreignKey: 'user_id' });

//jointure step-> ingredients
Step.belongsToMany(Ingredient, { through: Step_Ingredient });
Ingredient.belongsToMany(Step, { through: Step_Ingredient });

//jointure follows
User.belongsToMany(Recipe, { through: Follow, as: 'FollowedRecipes', foreignKey: 'user_id' });
Recipe.belongsToMany(User, { through: Follow, as: 'Followers', foreignKey: 'recipe_id' });