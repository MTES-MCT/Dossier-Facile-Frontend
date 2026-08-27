import { Property } from 'df-shared-next/src/models/Property'
import axios from 'axios'
import type { OwnerUser } from 'df-shared-next/src/models/OwnerUser'
import type { NamesForm } from 'df-shared-next/src/models/NamesForm'

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`

const OwnerService = {
  saveNames(namesForm: NamesForm) {
    return axios.post<OwnerUser>(`${API_URL}owner/names`, namesForm)
  },
  saveProperty(property: Property) {
    return axios.post<Property>(`${API_URL}property`, {
      ...property
    })
  },
  deleteDpe(propertyId: number) {
    return axios.delete<OwnerUser>(`${API_URL}property/dpe/${propertyId}`)
  },
  deleteProperty(id: number) {
    return axios.delete<OwnerUser>(`${API_URL}property/${id}`)
  },
  deleteApplicants(ids: number[]) {
    const promises = []
    for (let i = 0; i < ids.length; i += 1) {
      promises.push(axios.delete<void>(`${API_URL}property/tenant/${ids[i]}`))
    }
    return Promise.all(promises)
  }
}

export default OwnerService
