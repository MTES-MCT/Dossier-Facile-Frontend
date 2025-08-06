export interface User {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export enum UserType {
  TENANT,
  OWNER,
}

const users: { [id: string]: User } = {
  thibault: {
    username: "test_THIBAULT",
    password: "123",
    firstname: "Thibault",
    lastname: "TABLE",
  },
  elsa: {
    username: "test_ELSA",
    password: "123",
    firstname: "Elsa",
    lastname: "PLACARD",
  },
  laurent: {
    username: "test_LAURENT",
    password: "123",
    firstname: "Laurent",
    lastname: "COIFFEUSE",
  },
  william: {
    username: "test_WILLIAM",
    password: "123",
    firstname: "William",
    lastname: "BALDAQUIN",
  },
  mario: {
    username: "test_CORSE_2A",
    password: "123",
    firstname: "Mario",
    lastname: "BROSSE",
  },
};

export function getTenantUser(): User {
  return users[Cypress.env("tenantUser")];
}

export function getOwnerUser(): User {
  return users[Cypress.env("ownerUser")];
}
