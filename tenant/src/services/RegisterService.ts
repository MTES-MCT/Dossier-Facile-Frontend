import axios from "axios";

export const RegisterService = {
    saveCorporationIdentification(formData: FormData) {
        const url = `//${process.env.VUE_APP_API_URL}/api/register/guarantorLegalPerson/documentIdentification`;
        return axios.post(url, formData);
    },

    deleteFile(id: number | string) {
    const url = `//${process.env.VUE_APP_API_URL}/api/file/${id}`;
    return axios.delete(url);

    }
};