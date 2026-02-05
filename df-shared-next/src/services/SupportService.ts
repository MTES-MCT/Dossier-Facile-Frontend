import axios from 'axios'
import { ContactFormData } from '../models/ContactFormData'

const API_URL = `${import.meta.env.VITE_API_URL}/api/`

export const SupportService = {
  sendMail(contactForm: ContactFormData) {
    console.log('YAAASS MAIL', contactForm)

    return axios.post<void>(API_URL + 'support/email', contactForm)
  }
}
