import axios from "axios";

export const OwnerService = {
  getOwnerData(token: string) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/tenant/property/${token}`;
    return axios.get(url);
  },
  registerToOwner(token: string) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/tenant/subscribe/${token}`;
    return axios.post(url, { access: true });
  },
  sendFileByMail(email: string, shareType: string) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/tenant/sendFileByMail`;
    return axios.post(url, { email, shareType });
  },
};
