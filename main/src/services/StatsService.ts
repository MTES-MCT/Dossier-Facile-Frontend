import axios from "axios";

const API_URL = `https://${process.env.VUE_APP_API_URL}/api/`;

export const StatsService = {
  getValidatedDossierCount() {
    return axios.get(API_URL + "stats/dossiers/validated/");
  },
};
