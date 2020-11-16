import { User } from "df-shared/src/models/User";
import axios from "axios";

export const ProfileService = {
  saveNames(user: User) {
    return axios.post(
      "//" + process.env.VUE_APP_API_URL + "/api/register/step2",
      {
        firstName: user.firstname,
        lastName: user.lastname
      }
    );
  },
  saveRoommates(data: {
    tenantType: string,
    coTenantEmail: string[],
    acceptAccess: boolean
  }) {
    return axios.post(
      "//" + process.env.VUE_APP_API_URL + "/api/register/step3",
      data
    );
  }
};
