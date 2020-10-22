import { User } from "df-shared/src/models/User";
import axios from "axios";

const API_URL = "http://localhost:8080/api/";

export const AuthService = {
  login(user: User) {
    return axios
      .post(API_URL + "auth", {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  },

  logout() {
    localStorage.removeItem("user");
  },

  register(user: User) {
    return axios.post(API_URL + "signup", {
      username: user.username,
      password: user.password
    });
  }
};
