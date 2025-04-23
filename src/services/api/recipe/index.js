import { http } from "../../config";

export default {
  createRecipe: async (
    name,
    desciption,
    userId,
    categorys,
    ingredientes,
    preparationMethod,
    images
  ) => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("desciption", desciption);
      formData.append("userId", userId);
      formData.append("categorys", JSON.stringify(categorys));
      formData.append("ingredients", JSON.stringify(ingredientes));
      formData.append("preparationMethod", JSON.stringify(preparationMethod));

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      const response = await http.post("/recipes/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
      });

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },

  myRecipes: async (id) => {
    try {
      const response = await http.get(`/recipes/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
      });

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },

  recipe: async (id) => {
    console.log("id aqui --->", id);
    try {
      const response = await http.get(`/recipes/recipe/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
      });

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },

  recommendedRecipes: async (id, userId, recipeId) => {
    try {
      const response = await http.post(
        `/recipes/recommended-recipes/${id}`,
        {
          userId: userId,
          recipeId: recipeId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
          },
        }
      );

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },
};
