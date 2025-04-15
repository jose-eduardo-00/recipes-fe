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

  allUsers: async () => {
    try {
      const response = await http.get("/users/", {
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

  editActivatedUser: async (id, activated) => {
    try {
      const response = await http.put(
        `/users/edit-activated/${id}`,
        {
          activated: activated,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,PUT",
          },
        }
      );

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await http.delete(`/users/delete/${id}`, {
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

  editUser: async (id, firstName, lastName, email, password, pushToken) => {
    try {
      const response = await http.put(
        `/users/edit/${id}`,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          pushToken: pushToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,PUT",
          },
        }
      );

      return response;
    } catch (error) {
      return error.response || error.message || error;
    }
  },
};
