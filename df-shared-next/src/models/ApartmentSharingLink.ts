export type ApartmentSharingLink = {
  createdBy?: string
  creationDate: string
  deleted: boolean
  enabled: boolean
  expirationDate: string
  fullData: boolean
  id: number
  firstVisit: string
  lastVisit: string
  nbVisits: number
  ownerEmail: string
  title: string
  type: 'MAIL' | 'LINK' | 'PARTNER' | 'OWNER'
  url?: string
}

export type ApartmentSharingLinks = {
  links?: ApartmentSharingLink[]
}
