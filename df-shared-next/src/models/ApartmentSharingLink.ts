export type ApartmentSharingLink = {
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
}

export type ApartmentSharingLinks = {
  links?: ApartmentSharingLink[]
}
