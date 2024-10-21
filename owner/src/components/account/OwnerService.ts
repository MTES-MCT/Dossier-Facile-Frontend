import { Property } from 'df-shared-next/src/models/Property'
import axios from 'axios'

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`

const OwnerService = {
  saveNames(lastName: string, firstName: string, email: string) {
    return axios.post(`${API_URL}owner/names`, {
      lastName,
      firstName,
      email
    })
  },
  saveProperty(property: Property) {
    return axios.put(`${API_URL}property`, {
      ...property
    })
  },
  deleteDpe(propertyId: number) {
    return axios.delete(`${API_URL}property/dpe/${propertyId}`)
  },
  deleteProperty(id: number) {
    return axios.delete(`${API_URL}property/${id}`)
  },
  deleteApplicants(ids: number[]) {
    const promises = []
    for (let i = 0; i < ids.length; i += 1) {
      promises.push(axios.delete(`${API_URL}property/tenant/${ids[i]}`))
    }
    return Promise.all(promises)
  }
}

export default OwnerService
