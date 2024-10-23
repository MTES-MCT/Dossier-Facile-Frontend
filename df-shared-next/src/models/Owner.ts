export class Owner {
  id?: number
  name?: string
  address?: string
  rentCost?: number
  owner!: {
    id?: number
    firstName?: string
    lastName?: string
    email?: string
  }
}
