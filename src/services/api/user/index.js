import { http } from "../../config";

export default {
  createUser: async (firstName, lastName, email, password) => {
    try {
      const response = await http.post(
        "/users/register",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          pushToken: "",
          activated: 1,
          role: "client",
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
