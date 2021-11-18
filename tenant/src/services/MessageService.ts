import axios from "axios";

export const MessageService = {
  updateMessages() {
    return axios.get(`https://${process.env.VUE_APP_API_URL}/api/message`);
  },
  postMessage(data: { messageBody: string }) {
    return axios.post(`https://${process.env.VUE_APP_API_URL}/api/message`, data);
  }
};
