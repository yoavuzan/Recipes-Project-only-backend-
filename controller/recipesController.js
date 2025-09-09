//recipesController.js
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../DB/models/index.js");

function formatDateForMySQL(date) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}


async function getAllRecipes(req, res) {
  let query = "SELECT * FROM recipes";
  const replacements = {};

  if (req.query.difficulty) {
    query += " WHERE difficulty = :difficulty";
    replacements.difficulty = req.query.difficulty;
  }
  if (req.query.maxCookingTime) {
    query += " WHERE cookingTime <= :maxCookingTime";
    replacements.maxCookingTime = req.query.maxCookingTime;
  }
  if (req.query.search) {
    query += " WHERE title LIKE :search";
    replacements.search = `%${req.query.search}%`;
  }

  const [results, metadata] = await sequelize.query(query, {
    replacements,
  });

  return res.status(200).json(results);
}

async function getRecipeById(req, res) {
  const query = `SELECT * FROM recipes WHERE id = :id`;
  const [result, metadata] = await sequelize.query(query, {
    replacements: { id: req.params.id },
  });

  if (!result[0]) {
    return res
      .status(404)
      .json({ success: false, message: "Recipe not found" });
  }
  return res.json(result[0]);
}

async function createRecipe(req, res) {
  const query = `
  INSERT INTO recipes (
    id, 
    title, 
    description, 
    ingredients, 
    instructions, 
    cookingTime, 
    servings, 
    difficulty, 
    imageUrl, 
    isPublic, 
    userId, 
    createdAt, 
    updatedAt
  ) VALUES (
    :id, 
    :title, 
    :description, 
    :ingredients, 
    :instructions, 
    :cookingTime, 
    :servings, 
    :difficulty, 
    :imageUrl, 
    :isPublic, 
    :userId, 
    :createdAt, 
    :updatedAt
  )
`;
  const [result, metadata] = await sequelize.query(query, {
    replacements: {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      ingredients: JSON.stringify(req.body.ingredients),
      instructions: JSON.stringify(req.body.instructions),
      cookingTime: req.body.cookingTime,
      servings: req.body.servings,
      difficulty: req.body.difficulty,
      imageUrl: req.body.imageUrl,
      isPublic: req.body.isPublic,
      userId: req.user.id,
      createdAt: formatDateForMySQL(new Date()),
      updatedAt: formatDateForMySQL(new Date()),
    },
  });

  return res.status(201).json(result);
}

async function updateRecipe(req, res) {
const query = `
  UPDATE recipes 
  SET 
    title = :title,
    description = :description,
    ingredients = :ingredients,
    instructions = :instructions,
    cookingTime = :cookingTime,
    servings = :servings,
    difficulty = :difficulty,
    updatedAt = :updatedAt
  WHERE id = :id
`;

const [result, metadata] = await sequelize.query(query, {
  replacements: {
    id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    ingredients: JSON.stringify(req.body.ingredients),
    instructions: JSON.stringify(req.body.instructions),
    cookingTime: req.body.cookingTime,
    servings: req.body.servings,
    difficulty: req.body.difficulty,
    updatedAt: formatDateForMySQL(new Date()), 
  }
});


  if (metadata[1] === 0) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  return res.json(result);
}

async function deleteRecipe(req, res) {
  const query = `DELETE FROM recipes WHERE id = :id`;
  const [result, metadata] = await sequelize.query(query, {
    replacements: { id: req.params.id },
  });

  if (metadata.affectedRows === 0) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  return res.status(204).send();
}

async function getRecipeStats(req, res) {
  const query = `SELECT * FROM recipes`;
  const [results, metadata] = await sequelize.query(query);

  const recipes = results;
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
