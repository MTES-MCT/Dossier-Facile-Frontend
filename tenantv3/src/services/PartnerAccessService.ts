import axios from 'axios'
import { PartnerAccess } from 'df-shared-next/src/models/PartnerAccess'

const API_URL = import.meta.env.VITE_API_URL
const LINKS_API_URL = `${API_URL}/api/tenant/partners`

export const PartnerAccessService = {
  getPartners() {
    return axios.get<PartnerAccess[]>(LINKS_API_URL)
  },
  revokeAccess(access: PartnerAccess) {
    return axios.delete(`${LINKS_API_URL}/${access.id}`)
  }
}
