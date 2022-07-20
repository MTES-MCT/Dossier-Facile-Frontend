import axios from 'axios';

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`;

const PropertyService = {
  loadProperty(token: string) {
    return axios.get(`${API_URL}property/public/${token}`);
  },
  subscribe(tenantId: number, token: string) {
    const url = `${API_URL}property/public/subscribe/${token}/${tenantId}`;
    return axios.post(url, { access: true });
  },
};

export default PropertyService;
