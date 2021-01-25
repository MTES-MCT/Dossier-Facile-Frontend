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
      }).catch(()=>{
        Vue.toasted.global.delete_failed();
      }).finally(() => {
        loader.hide();
        store.dispatch("loadUser");
      });

    }
};