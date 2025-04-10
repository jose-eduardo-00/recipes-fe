import { http } from "../../config";

export default {
  createCategory: async (name, userId) => {
    try {
      const response = await http.post(
        "/category/create",
        {
          name: name,
          userId: userId,
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

  allCategorys: async () => {
    try {
      const response = await http.get("/category/", {
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

  deleteCategory: async (id) => {
    try {
      const response = await http.delete(`/category/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "OPTIONS,DELETE",
        },
      });

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },
};
