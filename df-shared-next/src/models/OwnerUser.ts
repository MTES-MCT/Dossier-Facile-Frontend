import { type LightProperty } from './Property'

export class OwnerUser {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  properties?: LightProperty[]
}
