import axios from 'axios'
import { Property } from 'df-shared-next/src/models/Property'
import Applicant from '../components/property/Applicant'

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
    return axios.get(`${API_URL}property/listAddresses/${label}`)
  },
  getTenants(p: Property): Applicant[] {
    if (!p.propertiesApartmentSharing) {
      return []
    }

    const activeApartmentSharingApplications = p.propertiesApartmentSharing.filter(
      (pas: any) => pas.apartmentSharing.status !== 'ARCHIVED'
    )

    return activeApartmentSharingApplications.map((pas: any) => {
      const a = pas.apartmentSharing
      if (a !== undefined && a.tenants.length > 0) {
        const rate = a.totalSalary > 0 ? Math.round(p.rentCost * 100 / a.totalSalary) : -1
        const mainTenant = a.tenants.find((t: Applicant) => t.tenantType === 'CREATE')
        return {
          id: pas.id,
          lastUpdateDate: mainTenant.lastUpdateDate
            ? new Date(mainTenant.lastUpdateDate)
            : new Date(),
          tenantName: `${mainTenant.lastName} ${mainTenant.firstName}`,
          tenantType: a.applicationType,
          tenantSalary: `${a.totalSalary} €`,
          guarantorSalary: a.totalGuarantorSalary ? `${a.totalGuarantorSalary} €` : '-',
          rate: rate,
          status: a.status,
          token: a.token
        }
      }
      return {}
    })
  },
}

export default UtilsService
