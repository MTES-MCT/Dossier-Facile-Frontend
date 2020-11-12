import { User } from "../models/User";
import axios from "axios";

const API_URL = "//" + process.env.VUE_APP_API_URL + "/api/";

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
    return axios.post(API_URL + "register/step1", {
      email: user.username,
      password: user.password,
      confirm: user.confirm,
      captcha: user.captcha
    });
  },

  authHeaders(user: User) {
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token }
    } else {
      return {};
    }

  }
};
