import { Property } from 'df-shared/src/models/Property';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`;

const OwnerService = {
  saveNames(lastName: string, firstName: string, email: string) {
    return axios.post(`${API_URL}owner/names`, {
      lastName, firstName, email,
    });
  },
  saveProperty(property: Property) {
    return axios.put(`${API_URL}property`, {
      ...property,
    });
  },
};

export default OwnerService;
