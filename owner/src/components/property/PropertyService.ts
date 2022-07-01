import axios from 'axios';

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`;

const PropertyService = {
  loadProperty(id: number) {
    return axios.get(`${API_URL}property/public/${id}`);
  },
};

export default PropertyService;
