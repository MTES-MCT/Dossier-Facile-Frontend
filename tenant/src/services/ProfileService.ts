import { User } from "df-shared/src/models/User";
import axios from "axios";
import { Guarantor } from "df-shared/src/models/Guarantor";

export const ProfileService = {
  saveNames(user: User) {
    return axios.post(`//${process.env.VUE_APP_API_URL}/api/register/names`, {
      firstName: user.firstName,
      lastName: user.lastName,
      zipCode: user.zipCode
    });
  },
  saveRoommates(data: {
    applicationType: string;
    coTenantEmail: string[];
    acceptAccess: boolean;
  }) {
    return axios.post(
      `//${process.env.VUE_APP_API_URL}/api/register/application`,
      data
    );
  },
  validateFile(honorDeclaration: boolean) {
    return axios.post(
      `//${process.env.VUE_APP_API_URL}/api/register/honorDeclaration`,
      { honorDeclaration }
    );
  },
  setGuarantorType(typeGuarantor: string) {
    return axios.post(
      `//${process.env.VUE_APP_API_URL}/api/register/guarantorType`,
      { typeGuarantor }
    );
  },
  deleteGuarantor(g: Guarantor) {
    return axios.delete(
      `//${process.env.VUE_APP_API_URL}/api/guarantor/${g.id}`
    );
  },
  deleteDocument(id: number) {
    return axios.delete(`//${process.env.VUE_APP_API_URL}/api/document/${id}`);
  },
  getUserByToken(token: string) {
    return axios.get(
      `//${process.env.VUE_APP_API_URL}/api/application/full/${token}`
    );
  },
  getPublicUserByToken(token: string) {
    return axios.get(
      `//${process.env.VUE_APP_API_URL}/api/application/light/${token}`
    );
  }
};
