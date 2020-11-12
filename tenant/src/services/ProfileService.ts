import { User } from "df-shared/src/models/User";
import axios from "axios";
import {AuthService} from "df-shared/src/services/AuthService";

export const ProfileService = {
  saveNames(user: User) {
    return axios.post("//" + process.env.VUE_APP_API_URL + "/api/register/step2", {
      firstName: user.firstname,
      lastName: user.lastname
    }, { headers: AuthService.authHeaders(user)} );
  }
};
