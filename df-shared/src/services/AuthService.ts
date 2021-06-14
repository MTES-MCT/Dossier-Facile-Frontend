import { User } from "../models/User";
import axios from "axios";

const API_URL = `https://${process.env.VUE_APP_API_URL}/api/`;
const SSO_ENDPOINT = process.env.VUE_APP_API_URL;
const CALLBACK_URI = process.env.VUE_APP_CALLBACK_URI;

export const AuthService = {
  login(params: any = {}) {
    let searchParams = new URLSearchParams(params).toString();
    if (searchParams !== "") {
      searchParams = "?" + searchParams;
    }

    const url =
      `${SSO_ENDPOINT}?response_type=code&state=&client_id=login-app&scope=openid&redirect_uri=` +
      encodeURIComponent(CALLBACK_URI + searchParams);
    window.location.href = url;
/*     const response = await axios.post(API_URL + "auth", {
      username: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      source: source,
      internalPartnerId: internalPartnerId
    });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data; */
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
    return axios.post(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password
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
