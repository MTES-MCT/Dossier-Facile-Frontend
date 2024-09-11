import { User } from "df-shared-next/src/models/User";
import axios from "axios";
import { Guarantor } from "df-shared-next/src/models/Guarantor";

export const ProfileService = {
  unlinkFranceConnect(): Promise<boolean> {
    return axios.delete(
      `${import.meta.env.VITE_API_URL}/api/user/franceConnect`
    );
  },
  saveNames(user: User) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/names`,
      {
        tenantId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        preferredName: user.preferredName,
        zipCode: user.zipCode,
      }
    );
  },
  saveCoTenants(data: {
    applicationType: string;
    coTenants: User[];
    acceptAccess: boolean;
  }) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/application/v2`,
      data
    );
  },
  getCoTenant(id: number) {
    return axios.delete(
      `${import.meta.env.VITE_API_URL}/api/tenant/coTenant/${id}/profile`
    );
  },
  async deleteCoTenant(id: number) {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/tenant/deleteCoTenant/${id}`
    );
  },
  validateFile(honorDeclaration: boolean, clarification: string) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/honorDeclaration`,
      { honorDeclaration, clarification }
    );
  },
  setGuarantorType(typeGuarantorData: any) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorType`,
      typeGuarantorData
    );
  },
  deleteGuarantor(g: Guarantor) {
    return axios.delete(
      `${import.meta.env.VITE_API_URL}/api/guarantor/${g.id}`
    );
  },
  deleteDocument(id: number) {
    return axios.delete(
      `${import.meta.env.VITE_API_URL}/api/document/${id}`
    );
  },
  getUserByToken(token: string) {
    return axios.get(
      `${import.meta.env.VITE_API_URL}/api/application/full/${token}`
    );
  },
  getPublicUserByToken(token: string) {
    return axios.get(
      `${import.meta.env.VITE_API_URL}/api/application/light/${token}`
    );
  },
  postCreateFullPdf(token: string): Promise<VoidFunction> {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/application/fullPdf/${token}`,
      {}
    );
  },
  getFile(fileUrl: string): Promise<any> {
    return axios.get(fileUrl, { responseType: "blob" });
  },
  downloadZip() {
    return axios.get(`${import.meta.env.VITE_API_URL}/api/application/zip`, {
      responseType: "blob",
    });
  },
  getExpectedProcessingTime(tenantId : number): Promise<string> {
    return axios.get(
        `${import.meta.env.VITE_API_URL}/api/tenant/${tenantId}/expectedProcessingTime`
    );
  }
};
