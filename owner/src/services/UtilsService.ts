import axios from 'axios'
import { Property } from 'df-shared-next/src/models/Property'
import type { GeoJson } from 'df-shared-next/src/models/GeoJson'
import type { Applicant } from '../components/property/Applicant'

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`

const UtilsService = {
  isMobile() {
    return window.innerWidth < 768
  },
  capitalize(w: string) {
    const word = w[0].toUpperCase() + w.slice(1).toLowerCase()
    return word.replace(/([' -][A-Za-zÀ-ÖØ-öø-ÿ])/g, (s) => s.toUpperCase())
  },
  getAddresses(label: string) {
    return axios.get<GeoJson>(`${API_URL}property/listAddresses/${label}`)
  },
  getTenants(p: Property): Applicant[] {
    if (!p.propertiesApartmentSharing) {
      return []
    }

    const activeApartmentSharingApplications = p.propertiesApartmentSharing.filter(
      (pas) => pas.apartmentSharing.status !== 'ARCHIVED'
    )

    return activeApartmentSharingApplications.flatMap((pas) => {
      const a = pas.apartmentSharing
      if (a !== undefined && a.tenants.length > 0) {
        const rate =
          a.totalSalary && a.totalSalary > 0 ? Math.round((p.rentCost * 100) / a.totalSalary) : -1
        const mainTenant = a.tenants.find((t) => t.tenantType === 'CREATE')
        return {
          id: pas.id,
          lastUpdateDate: new Date(),
          tenantName: mainTenant ? `${mainTenant.lastName} ${mainTenant.firstName}` : '',
          applicationType: a.applicationType,
          tenantSalary: `${a.totalSalary} €`,
          guarantorSalary: a.totalGuarantorSalary ? `${a.totalGuarantorSalary} €` : '-',
          rate: rate,
          status: a.status,
          token: a.token,
          email: '',
          apartmentSharing: { tenants: [] },
          guarantors: []
        } satisfies Applicant
      }
      return []
    })
  }
}

export default UtilsService
