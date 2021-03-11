import { User } from "../models/User";
import axios from "axios";

const API_URL = `//${process.env.VUE_APP_API_URL}/api/`;

export const AuthService = {
  login(user: User, source: string, internalPartnerId: string) {
    return axios
      .post(API_URL + "auth", {
        username: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        source: source,
        internalPartnerId: internalPartnerId
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

  register(user: User, source: string, internalPartnerId: string) {
    return axios.post(API_URL + "register/account", {
      email: user.email,
      password: user.password,
      confirm: user.confirm,
      reCaptchaResponse: user.captcha,
      firstName: user.firstName,
      lastName: user.lastName,
      source: source,
      internalPartnerId: internalPartnerId
    });
  },

  deleteAccount(password: string) {
    return axios.delete(API_URL + "user/deleteAccount", {
      params: {
        password: password
      }
    });
  },

  resetPassword(user: User) {
    return axios.post(API_URL + "user/forgotPassword", {
      email: user.email
    });
  },

  changePassword(user: User) {
    return axios.post(API_URL + "user/changePassword", {
      password: user.password,
      passwordConfirmation: user.confirm,
      token: user.token
    });
  },
  createPasswordCouple(user: User) {
    return axios.post(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password
    });
  },
  createPasswordGroup(user: User) {
    return axios.post(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password
    });
  },

  loadUser() {
    return axios.get(API_URL + "tenant/profile");
  },

  confirmAccount(token: string) {
    return axios.get(`${API_URL}register/confirmAccount/${token}`);
  }
};
