import axios from "axios";
import { LoaderComponent } from "vue-loading-overlay";
import store from "../store";
import Vue from "vue";

export const RegisterService = {
    saveCorporationIdentification(formData: FormData) {
        const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentIdentification`;
        return axios.post(url, formData);
    },

    saveOrganismIdentification(formData: FormData) {
        const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorOrganism/documentIdentification`;
        return axios.post(url, formData);
    },

    deleteFile(id: number | string) {
        const loader = Vue.$loading.show();
        const url = `//${process.env.VUE_APP_API_URL}/api/file/${id}`;
        return axios.delete(url).then(() => {
            Vue.toasted.global.delete_success();
        }).catch(() => {
            Vue.toasted.global.delete_failed();
        }).finally(() => {
            loader.hide();
            store.dispatch("loadUser");
        });

    },

    saveFinancial(formData: FormData) {
        let url: string;
        if (store.getters.isGuarantor) {
            url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentFinancial`;
        } else {
            url = `//${process.env.VUE_APP_API_URL}/api/register/documentFinancial`;
        }
        return axios.post(url, formData)
    },

    saveIdentification(formData: FormData) {
        let url: string;
        if (store.getters.isGuarantor) {
            url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentIdentification`;
        } else {
            url = `//${process.env.VUE_APP_API_URL}/api/register/documentIdentification`;
        }
        return axios
            .post(url, formData)
    },

    saveProfessional(formData: FormData) {
        let url: string;
        if (store.getters.isGuarantor) {
            url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorNaturalPerson/documentProfessional`;
        } else {
            url = `//${process.env.VUE_APP_API_URL}/api/register/documentProfessional`;
        }
        return axios.post(url, formData)
    },

    saveRepresentativeIdentification(formData: FormData) {
        const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentRepresentanIdentification`;
        return axios.post(url, formData)
    }
};