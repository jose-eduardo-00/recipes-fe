import { http } from "../../config";

export default {
  createRecipe: async (name, desciption, userId, categorys) => {
    try {
      const response = await http.post(
        "/recipes/create",
        {
          name: name,
          desciption: desciption,
          userId: userId,
          categorys: categorys,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
          },
        }
      );

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },
};
