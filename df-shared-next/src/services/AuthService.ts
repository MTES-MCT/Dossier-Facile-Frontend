import { apiService } from "./../../../tenantv3/src/services/ApiService";
import { User } from "../models/User";
import axios from "axios";
import { CookiesService } from "./CookiesService";

const API_URL = `${import.meta.env.VITE_API_URL}/api/`;

export const AuthService = {
  logout() {
    return axios.post(API_URL + "user/logout");
  },

  register(user: User, source: string, internalPartnerId: string) {
    return axios.post(API_URL + "register/account", {
      email: user.email,
      password: user.password,
      confirm: user.confirm,
      firstName: user.firstName,
      lastName: user.lastName,
      source: source,
      internalPartnerId: internalPartnerId,
    });
  },

  deleteAccount() {
    return axios.delete(API_URL + "user/deleteAccount");
  },

  resetPassword(user: User) {
    return axios.post(API_URL + "user/forgotPassword", {
      email: user.email,
    });
  },

  changePassword(user: User) {
    return axios.post(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password,
    });
  },
  createPasswordCouple(user: User) {
    return axios.post(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password,
    });
  },
  createPasswordGroup(user: User) {
    return axios.post(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password,
    });
  },

  loadUser() {
    return apiService
      .get("tenant/profile", {
        params: {
          nocache: new Date().getTime(),
          ...CookiesService.getJsonCookie("acquisition"),
        },
      })
      .then((res) => {
        CookiesService.deleteCookie("acquisition");
        return res;
      });
  },

  confirmAccount(token: string) {
    return axios.get(`${API_URL}register/confirmAccount/${token}`);
  },
};
