import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/`;

export const DSNService = {
  addRevenu() {
    return axios.post(API_URL + "dsn/documents", null);
  },
  addResource() {
    return axios.post(API_URL + "dsn/documentProfessional", null);
  }
};
