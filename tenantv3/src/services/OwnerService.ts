import axios from 'axios'

export const OwnerService = {
  sendFileByMail(email: string, shareType: string) {
    const url = `${import.meta.env.VITE_API_URL}/api/tenant/sendFileByMail`
    return axios.post(url, { email, shareType })
  }
}
