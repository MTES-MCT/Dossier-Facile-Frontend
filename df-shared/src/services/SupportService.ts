import axios from "axios";
import { ContactFormData } from "../models/ContactFormData";

const API_URL = `https://${process.env.VUE_APP_API_URL}/api/`;

export const SupportService = {
  sendMail(contactForm: ContactFormData) {
    return axios.post(API_URL + "support/email", contactForm);
  }
};
