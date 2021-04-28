import axios from "axios";

export const OwnerService = {
  getOwnerData(token: string) {
    const url = `//${process.env.VUE_APP_API_URL}/api/tenant/property/${token}`;
    return axios.get(url);
  },
  registerToOwner(token: string) {
    const url = `//${process.env.VUE_APP_API_URL}/api/tenant/subscribe/${token}`;
    return axios.post(url, { access: true });
  }
};
