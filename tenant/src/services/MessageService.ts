import axios from "axios";
import { DfMessage } from "df-shared/src/models/DfMessage";

const MESSAGE_ENDPOINT = `https://${process.env.VUE_APP_API_URL}/api/message`;

export const MessageService = {
  updateMessages(tenantId?: number) {
    return axios.get<DfMessage[]>(MESSAGE_ENDPOINT, {
      params: { tenantId },
    });
  },
  postMessage(data: { tenantId?: number; messageBody: string }) {
    return axios.post<DfMessage>(MESSAGE_ENDPOINT, data);
  },
  markMessagesAsRead(tenantId?: number) {
    return axios.put<DfMessage[]>(`${MESSAGE_ENDPOINT}/read`, null, {
      params: { tenantId },
    });
  },
};
