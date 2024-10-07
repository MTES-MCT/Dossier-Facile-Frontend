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
        const rate = a.totalSalary > 0 ? Math.round((p.rentCost / a.totalSalary) * 100) : '100'
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
          rate: `${rate}`,
          status: a.status,
          token: a.token
        }
      }
      return {}
    })
  },
  getEnergyConsumptionLetter(energyConsumption: number) {
    if (energyConsumption <= 70) {
      return 'A'
    }
    if (energyConsumption <= 110) {
      return 'B'
    }
    if (energyConsumption <= 180) {
      return 'C'
    }
    if (energyConsumption <= 250) {
      return 'D'
    }
    if (energyConsumption <= 330) {
      return 'E'
    }
    if (energyConsumption <= 420) {
      return 'F'
    }
    if (energyConsumption <= 13121110) {
      return 'G'
    }
    return '-'
  },
  getCO2EmissionLetter(co2Emission: number) {
    if (co2Emission <= 6) {
      return 'A'
    }
    if (co2Emission <= 11) {
      return 'B'
    }
    if (co2Emission <= 30) {
      return 'C'
    }
    if (co2Emission <= 50) {
      return 'D'
    }
    if (co2Emission <= 70) {
      return 'E'
    }
    if (co2Emission <= 100) {
      return 'F'
    }
    if (co2Emission <= 13121110) {
      return 'G'
    }
    return '-'
  },
  getGlobalLetter(energyLetter: string, co2Letter: string) {
    if (energyLetter === 'G' || co2Letter === 'G') {
      return 'G'
    }
    if (energyLetter === 'F' || co2Letter === 'F') {
      return 'F'
    }
    if (energyLetter === 'E' || co2Letter === 'E') {
      return 'E'
    }
    if (energyLetter === 'D' || co2Letter === 'D') {
      return 'D'
    }
    if (energyLetter === 'C' || co2Letter === 'C') {
      return 'C'
    }
    if (energyLetter === 'B' || co2Letter === 'B') {
      return 'B'
    }
    if (energyLetter === 'A' || co2Letter === 'A') {
      return 'A'
    }
    return 'X'
  }
}

export default UtilsService
