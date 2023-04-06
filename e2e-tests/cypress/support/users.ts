export interface User {
  username: string,
  firstname: string,
  lastname: string
}

export enum UserType {
  TENANT,
  OWNER
}

const users: {[id: string]: User} = {
  thibault: {
    username: "test_THIBAULT",
    firstname: "Thibault",
    lastname: "TABLE"
  },
  elsa: {
    username: "test_ELSA",
    firstname: "Elsa",
    lastname: "PLACARD"
  },
  laurent: {
    username: "test_LAURENT",
    firstname: "Laurent",
    lastname: "COIFFEUSE"
  },
  william: {
    username: "test_WILLIAM",
    firstname: "William",
    lastname: "BALDAQUIN"
  },
}

export function getTenantUser(): User {
  return users[Cypress.env("tenantUser")];
}

export function getOwnerUser(): User {
  return users[Cypress.env("ownerUser")];
}