import axios from "axios";

const API_URL = `https://${process.env.VUE_APP_API_URL}/api/`;
const GOOGLE_API_KEY = `${process.env.VUE_APP_GOOGLE_API_KEY}`;
const STATS_SPREADSHEET_ID = `${process.env.VUE_APP_STATS_SPREADSHEET_ID}`;

export const StatsService = {
  getValidatedDossierCount() {
    return axios.get(API_URL + "stats/dossiers/validated");
  },
  getDataFromStatsSpreadsheet(ranges: string, majorDimension: string) {
    return axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${STATS_SPREADSHEET_ID}/values:batchGet?key=${GOOGLE_API_KEY}`,
      { params: { ranges, majorDimension } }
    );
  },
};
