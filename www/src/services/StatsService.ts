import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/api/`

export const StatsService = {
  getValidatedDossierCount() {
    return axios.get(API_URL + 'stats/dossiers/validated')
  }
}
