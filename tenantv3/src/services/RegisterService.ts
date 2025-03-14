import { useTenantStore } from '@/stores/tenant-store'
import axios from 'axios'
import { ToastService } from './ToastService'
import { useLoading } from 'vue-loading-overlay'
import type { User } from 'df-shared-next/src/models/User'

const $loading = useLoading({})

export const RegisterService = {
  async deleteFile(id: number | string, silent = false) {
    const loader = $loading.show()
    const url = `${import.meta.env.VITE_API_URL}/api/file/${id}`
    try {
      await axios.delete<void>(url)
      if (!silent) {
        ToastService.deleteSuccess()
      }
    } catch {
      ToastService.deleteFailed()
    } finally {
      loader.hide()
      const store = useTenantStore()
      await store.loadUser()
    }
  },
  deleteFileById(id: number) {
    const url = `${import.meta.env.VITE_API_URL}/api/file/${id}`
    return axios.delete<void>(url)
  },
  saveTenantIdentification(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/documentIdentification`,
      formData
    )
  },

  saveGuarantorName(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/name`,
      formData
    )
  },

  saveGuarantorIdentification(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentIdentification/v2`,
      formData
    )
  },

  saveTenantResidency(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/documentResidency`,
      formData
    )
  },

  saveGuarantorResidency(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentResidency`,
      formData
    )
  },

  saveTenantProfessional(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/documentProfessional`,
      formData
    )
  },

  saveGuarantorProfessional(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentProfessional`,
      formData
    )
  },

  saveTenantFinancial(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/documentFinancial`,
      formData
    )
  },

  saveGuarantorFinancial(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentFinancial`,
      formData
    )
  },

  saveTenantTax(formData: FormData) {
    return axios.post<User>(`${import.meta.env.VITE_API_URL}/api/register/documentTax`, formData)
  },
  saveGuarantorTax(formData: FormData) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentTax`,
      formData
    )
  },

  saveRepresentativeIdentification(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/documentRepresentantIdentification`
    return axios.post<User>(url, formData)
  },

  saveCorporationName(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/name`
    return axios.post<User>(url, formData)
  },

  saveLegalPersonRepresentantName(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/representing-name`
    return axios.post<User>(url, formData)
  },

  saveCorporationIdentification(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/documentIdentification`
    return axios.post<User>(url, formData)
  },

  saveOrganismIdentification(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorOrganism/documentCertificate`
    return axios.post<User>(url, formData)
  },
  commentAnalysis(formData: unknown) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/document/commentAnalysis`,
      formData
    )
  }
}
