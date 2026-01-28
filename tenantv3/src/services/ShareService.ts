import axios from 'axios'

type ShareByLinkParams = {
  fullData: boolean
  title: string
  daysValid: number
}

type ShareByMailParams = ShareByLinkParams & {
  email: string
  message: string
}

const API_URL = `${import.meta.env.VITE_API_URL}/api/tenant`

export const ShareService = {
  createLink(params: ShareByLinkParams) {
    return axios.post<string>(`${API_URL}/createSharingLink`, params)
  },
  sendFileByMail(params: ShareByMailParams) {
    return axios.post<void>(`${API_URL}/sendFileByMail`, params)
  }
}
