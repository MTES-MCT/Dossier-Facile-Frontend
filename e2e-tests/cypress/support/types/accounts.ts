export type Realm = "tenant" | "owner";

export interface SavedCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  expiry?: number;
  sameSite?: "strict" | "lax" | "no_restriction";
}

export interface AccountFixture {
  key: string;
  realm: Realm;
  email: string;
  password: string;
  nextPassword: string;
  keycloakId: string;
  localId?: number;
  sharingId?: number;
  link?: string;
  cookies?: SavedCookie[];
  property?: { id: number; name: string; token: string };
}

export interface AccountSnapshot {
  identity: {
    id: string;
    email: string;
    enabled: boolean;
    emailVerified: boolean;
    requiredActions: string[];
    credentials: Array<{ id: string; type: string; createdDate?: number }>;
  };
  local: {
    id: number;
    email: string;
    keycloakId: string | null;
    enabled: boolean;
    userType: string;
  } | null;
  token: { id: number; digest: string; expiration: string | null } | null;
}

export interface TenantProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  apartmentSharing: {
    id: number;
    applicationType: "ALONE" | "GROUP" | "COUPLE";
    tenants: Array<{ id: number; email?: string }>;
  };
}

export interface OwnerProfile {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  properties?: Array<{
    id: number;
    name: string;
    propertyApartmentSharingCount: number;
  }>;
}
