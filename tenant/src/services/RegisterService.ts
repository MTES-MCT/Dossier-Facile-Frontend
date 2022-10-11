import axios from "axios";
import store from "../store";
import Vue from "vue";

export const RegisterService = {
  deleteFile(id: number | string, silent = false) {
    const loader = Vue.$loading.show();
    const url = `https://${process.env.VUE_APP_API_URL}/api/file/${id}`;
    return axios
      .delete(url)
      .then(() => {
        if (!silent) {
          Vue.toasted.global.delete_success();
        }
      })
      .catch(() => {
        Vue.toasted.global.delete_failed();
      })
      .finally(() => {
        loader.hide();
        store.dispatch("loadUser");
      });
  },

  saveTenantIdentification(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/documentIdentification`,
      formData
    );
  },

  saveTaxAuth(allowTax: boolean, redirectUri: string) {
    return axios.get(
      `https://${process.env.VUE_APP_API_URL}/api/tenant/allowTax/${allowTax}?redirectUri=${redirectUri}`
    );
  },

  saveGuarantorName(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/name`,
      formData
    );
  },

  saveGuarantorIdentification(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentIdentification/v2`,
      formData
    );
  },

  saveTenantResidency(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/documentResidency`,
      formData
    );
  },

  saveGuarantorResidency(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentResidency`,
      formData
    );
  },

  saveTenantProfessional(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/documentProfessional`,
      formData
    );
  },

  saveGuarantorProfessional(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentProfessional`,
      formData
    );
  },

  saveTenantFinancial(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/documentFinancial`,
      formData
    );
  },

  saveGuarantorFinancial(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentFinancial`,
      formData
    );
  },

  saveTenantTax(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/documentTax`,
      formData
    );
  },
  saveGuarantorTax(formData: FormData) {
    return axios.post(
      `https://${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentTax`,
      formData
    );
  },

  saveRepresentativeIdentification(formData: FormData) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentRepresentantIdentification`;
    return axios.post(url, formData);
  },

  saveCorporationIdentification(formData: FormData) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentIdentification`;
    return axios.post(url, formData);
  },

  saveOrganismIdentification(formData: FormData) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/register/guarantorOrganism/documentIdentification`;
    return axios.post(url, formData);
  },

  connectSource(internalPartnerId: string, source: string) {
    const url = `https://${process.env.VUE_APP_API_URL}/api/tenant/linkTenantToPartner`;
    return axios.post(url, {
      internalPartnerId: internalPartnerId,
      source: source
    });
  }
};
