import axios from "axios";

export const MessageService = {
  updateMessages(tenantId?: number) {
    if (tenantId) {
      return axios.get(
        `https://${process.env.VUE_APP_API_URL}/api/message?tenantId=` +
          tenantId
      );
    }
    return axios.get(`https://${process.env.VUE_APP_API_URL}/api/message`);
  },
  postMessage(data: { tenantId?: number; messageBody: string }) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/message`,
      data
    );
  }
};
