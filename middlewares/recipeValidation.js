const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const {recipeSchema} =require("../data/recipeSchema");

const ajv = new Ajv();
addFormats(ajv);

const validateRecipe = ajv.compile(recipeSchema);

function validateRecipeMiddleware(req, res, next) {
  const valid = validateRecipe(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors: validateRecipe.errors });
  }
  next();
}

module.exports = { validateRecipeMiddleware ,validateRecipe};
