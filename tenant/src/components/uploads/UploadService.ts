import axios from "axios";

export const UploadService = {
  upload(formData: FormData) {
    const url = `${process.env.VUE_APP_API_URL}/api/upload`;
    return axios.post(url, formData).then(x => x.data);
  }
};
