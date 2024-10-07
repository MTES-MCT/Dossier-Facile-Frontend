import axios from 'axios'

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`

const PropertyService = {
  loadOwnerProperty(id: number) {
    return axios.get(`${API_URL}property/${id}`)
  },
  loadProperty(token: string) {
    return axios.get(`${API_URL}property/public/${token}`)
  },
  subscribe(kcToken: string, token: string) {
    const url = `${API_URL}property/public/subscribe/${token}`
    return axios.post(url, { access: true, kcToken })
  }
}

export default PropertyService
