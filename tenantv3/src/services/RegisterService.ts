import useTenantStore from '@/stores/tenant-store'
import axios from 'axios'
import { ToastService } from './ToastService'
import { useLoading } from 'vue-loading-overlay'

const $loading = useLoading({})

export const RegisterService = {
  deleteFile(id: number | string, silent = false) {
    const loader = $loading.show()
    const url = `${import.meta.env.VITE_API_URL}/api/file/${id}`
    return axios
      .delete(url)
      .then(() => {
        if (!silent) {
          ToastService.deleteSuccess()
        }
      })
      .catch(() => {
        ToastService.deleteFailed()
      })
      .finally(() => {
        loader.hide()
        const store = useTenantStore()
        store.loadUser()
      })
  },
  deleteFileById(id: number) {
    const url = `${import.meta.env.VITE_API_URL}/api/file/${id}`
    return axios.delete(url)
  },
  saveTenantIdentification(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/documentIdentification`,
      formData
    )
  },

  saveCoTenantIdentification(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/tenant/coTenant/${formData.get(
        'coTenantId'
      )}/documentIdentification`,
      formData
    )
  },

  saveGuarantorName(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/name`,
      formData
    )
  },

  saveGuarantorIdentification(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentIdentification/v2`,
      formData
    )
  },

  saveTenantResidency(formData: FormData) {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/register/documentResidency`, formData)
  },

  saveGuarantorResidency(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentResidency`,
      formData
    )
  },

  saveTenantProfessional(formData: FormData) {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/register/documentProfessional`, formData)
  },

  saveGuarantorProfessional(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentProfessional`,
      formData
    )
  },

  saveTenantFinancial(formData: FormData) {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/register/documentFinancial`, formData)
  },

  saveGuarantorFinancial(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentFinancial`,
      formData
    )
  },

  saveTenantTax(formData: FormData) {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/register/documentTax`, formData)
  },
  saveGuarantorTax(formData: FormData) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorNaturalPerson/documentTax`,
      formData
    )
  },

  saveRepresentativeIdentification(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/documentRepresentantIdentification`
    return axios.post(url, formData)
  },

  saveCorporationName(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/name`
    return axios.post(url, formData)
  },

  saveLegalPersonRepresentantName(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/representing-name`
    return axios.post(url, formData)
  },

  saveCorporationIdentification(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorLegalPerson/documentIdentification`
    return axios.post(url, formData)
  },

  saveOrganismIdentification(formData: FormData) {
    const url = `${import.meta.env.VITE_API_URL}/api/register/guarantorOrganism/documentCertificate`
    return axios.post(url, formData)
  },
  async getFranceConnectToken() {
    return axios
      .get(`${import.meta.env.VITE_SSO_ENDPOINT}/realms/dossier-facile/broker/oidc/token`)
      .then((response: any) => {
        return Promise.resolve(response.data.access_token)
      })
      .catch((err) => {
        console.dir(err)
      })
  },
  commentAnalysis(formData: any) {
    return axios
      .post(`${import.meta.env.VITE_API_URL}/api/document/commentAnalysis`, formData)
      .then((response: any) => {
        return Promise.resolve(response.data)
      })
      .catch((err) => {
        console.dir(err)
      })
  }
}
