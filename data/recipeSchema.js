const recipeSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 36, maxLength: 36 }, // CHAR(36) -> UUID
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string" }, // TEXT
    ingredients: {
      type: "array",
      items: { type: "string" },
      minItems: 1
    },
    instructions: {
      type: "array",
      items: { type: "string" },
      minItems: 1
    },
    cookingTime: { type: "integer", minimum: 0 },
    servings: { type: "integer", minimum: 0 },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    imageUrl: { type: "string", maxLength: 500, format: "uri" },
    isPublic: { type: "boolean", default: true },
    userId: { type: "string", minLength: 36, maxLength: 36 },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: [
    "title",
    "ingredients",
    "instructions",
    "cookingTime",
    "servings",
    "difficulty",
  ],
  additionalProperties: false
};



module.exports = { recipeSchema };
