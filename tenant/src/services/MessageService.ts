import axios from "axios";

export const MessageService = {
  updateMessages() {
    return axios.get(`//${process.env.VUE_APP_API_URL}/api/message`);
  },
  postMessage(data: { messageBody: string }) {
    return axios.post(`//${process.env.VUE_APP_API_URL}/api/message`, data);
  }
};
