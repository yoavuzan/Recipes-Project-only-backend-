//recipesController.js
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { validateRecipe } = require("../middlewares/recipeValidation.js");

const dataPath = path.join(__dirname, "../models/listOfRecipes.json");

function readRecipes() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

function writeRecipes(recipes) {
  fs.writeFileSync(dataPath, JSON.stringify(recipes, null, 2), "utf-8");
}

function filterByDifficulty(recipes, difficulty) {
  return recipes.filter((recipe) => recipe.difficulty === difficulty);
}

function filterByMaxCookingTime(recipes, maxCookingTime) {
  const max = Number(maxCookingTime);
  return recipes.filter((recipe) => recipe.cookingTime <= max);
}

function filterBySearch(recipes, searchTerm) {
  return recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function getAllRecipes(req, res) {
  let filtered = readRecipes();

  if (req.query.difficulty) {
    const difficulty = req.query.difficulty.trim();
    filtered = filterByDifficulty(filtered, difficulty);
  }
  if (req.query.maxCookingTime) {
    const maxCookingTime = req.query.maxCookingTime.trim();
    filtered = filterByMaxCookingTime(filtered, maxCookingTime);
  }
  if (req.query.search) {
    const search = req.query.search.trim();
    filtered = filterBySearch(filtered, search);
  }

  return res.json(filtered);
}

function getRecipeById(req, res) {
  const recipes = readRecipes();
  const id = req.params.id;
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return res
      .status(404)
      .json({ success: false, message: "Recipe not found" });
  }
  return res.json(recipe);
}

function createRecipe(req, res) {
  const recipes = readRecipes();
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const newRecipe = { id, createdAt, ...req.body };
  recipes.push(newRecipe);
  writeRecipes(recipes);
  return res.status(201).json(newRecipe);
}

function updateRecipe(req, res) {
  const recipes = readRecipes();
  const index = recipes.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Recipe not found" });
  recipes[index] = { ...recipes[index], ...req.body };
  writeRecipes(recipes);
  res.json(recipes[index]);
}

function deleteRecipe(req, res) {
  const recipes = readRecipes();
  const index = recipes.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Recipe not found" });
  recipes.splice(index, 1);
  writeRecipes(recipes);
  res.status(204).send();
}

function getRecipeStats(req, res) {
  const recipes = readRecipes();
  const totalRecipes = recipes.length;

  const totalCookingTime = recipes.reduce(
    (sum, recipe) => sum + recipe.cookingTime,
    0
  );
  const averageCookingTime =
    totalRecipes > 0 ? totalCookingTime / totalRecipes : 0;

  const difficulties = recipes.reduce((acc, recipe) => {
    acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
    return acc;
  }, {});

  const ingredients = recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      acc[ingredient] = (acc[ingredient] || 0) + 1;
    });
    return acc;
  }, {});
  const mostCommonIngredient = Object.entries(ingredients).reduce(
    (acc, [ingredient, count]) => {
      if (count > acc.count) {
        return { ingredient, count };
      }
      return acc;
    },
    { ingredient: null, count: 0 }
  );

  res.json({
    totalRecipes,
    averageCookingTime,
    difficulties,
    mostCommonIngredient,
  });
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
};