import axios from 'axios';

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`;

const UtilsService = {
  isMobile() {
    return window.innerWidth < 768;
  },
  capitalize(w: string) {
    const word = w[0].toUpperCase() + w.slice(1).toLowerCase();
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, (s) => s.toUpperCase());
  },
  getAddresses(label: string) {
    return axios.get(`${API_URL}property/listAddresses/${label}`);
  },
};

export default UtilsService;
