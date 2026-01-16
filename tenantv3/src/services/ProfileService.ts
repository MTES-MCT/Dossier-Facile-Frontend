import { User } from 'df-shared-next/src/models/User'
import axios from 'axios'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { FileUser } from 'df-shared-next/src/models/FileUser'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

export const ProfileService = {
  unlinkFranceConnect() {
    return axios.delete<void>(`${import.meta.env.VITE_API_URL}/api/user/franceConnect`)
  },
  saveNames(user: User | CoTenant) {
    return axios.post<User>(`${import.meta.env.VITE_API_URL}/api/register/names`, {
      tenantId: user.id,
      ownerType: user.ownerType,
      firstName: user.firstName,
      lastName: user.lastName,
      preferredName: user.preferredName,
      zipCode: 'zipCode' in user ? user.zipCode : undefined,
      abroad: 'abroad' in user ? user.abroad : undefined
    })
  },
  saveCoTenants(data: { applicationType: string; coTenants: CoTenant[]; acceptAccess: boolean }) {
    return axios.post<User>(`${import.meta.env.VITE_API_URL}/api/register/application/v2`, data)
  },
  async deleteCoTenant(id: number) {
    await axios.delete<void>(`${import.meta.env.VITE_API_URL}/api/tenant/deleteCoTenant/${id}`)
  },
  validateFile(honorDeclaration: boolean, clarification: string | undefined) {
    return axios.post<User>(`${import.meta.env.VITE_API_URL}/api/register/honorDeclaration`, {
      honorDeclaration,
      clarification
    })
  },
  setGuarantorType(typeGuarantorData: unknown) {
    return axios.post<User>(
      `${import.meta.env.VITE_API_URL}/api/register/guarantorType`,
      typeGuarantorData
    )
  },
  deleteGuarantor(g: Guarantor) {
    return axios.delete<void>(`${import.meta.env.VITE_API_URL}/api/guarantor/${g.id}`)
  },
  deleteDocument(id: number) {
    return axios.delete<void>(`${import.meta.env.VITE_API_URL}/api/document/${id}`)
  },
  testLinkByToken(token: string) {
    return axios.head<FileUser>(`${import.meta.env.VITE_API_URL}/api/application/full/${token}`)
  },
  getLinkByToken(token: string, trigram?: string) {
    const headers = trigram ? { 'X-Tenant-Trigram': trigram } : {}
    
    return axios.get<FileUser>(`${import.meta.env.VITE_API_URL}/api/application/full/${token}`, {
      headers
    })
  },
  getPublicLinkByToken(token: string) {
    return axios.get<FileUser>(`${import.meta.env.VITE_API_URL}/api/application/light/${token}`)
  },
  postCreateFullPdf(token: string) {
    return axios.post<void>(`${import.meta.env.VITE_API_URL}/api/application/fullPdf/${token}`, {})
  },
  postCreateCurrentTenantPdf() {
    return axios.post<void>(`${import.meta.env.VITE_API_URL}/api/application/current-tenant/fullPdf`, {})
  },
  getCurrentTenantPdf() {
    return axios.get<Blob>(`${import.meta.env.VITE_API_URL}/api/application/current-tenant/fullPdf`, {
      responseType: 'blob'
    })
  },
  getCurrentTenantFullData() {
    return axios.get<FileUser>(`${import.meta.env.VITE_API_URL}/api/application/current-tenant/full`)
  },
  getFile(fileUrl: string) {
    return axios.get<Blob>(fileUrl, { responseType: 'blob' })
  },
  downloadZip() {
    return axios.get<Blob>(`${import.meta.env.VITE_API_URL}/api/application/zip`, {
      responseType: 'blob'
    })
  },
  getExpectedProcessingTime(tenantId: number) {
    return axios.get<string>(
      `${import.meta.env.VITE_API_URL}/api/tenant/${tenantId}/expectedProcessingTime`
    )
  }
}
