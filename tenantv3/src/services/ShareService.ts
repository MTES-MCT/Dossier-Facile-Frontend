import axios from 'axios'

export type ShareByMailParams = {
  email: string
  fullData: boolean
  title: string
  daysValid: number
}

export const ShareService = {
  sendFileByMail(params: ShareByMailParams) {
    const url = `${import.meta.env.VITE_API_URL}/api/tenant/sendFileByMail`
    return axios.post<''>(url, params)
  }
}
