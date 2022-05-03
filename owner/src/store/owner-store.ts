import { Property } from 'df-shared/src/models/Property';
import { User } from 'df-shared/src/models/User';
import { useCookies } from 'vue3-cookies';
import { Composer } from 'vue-i18n';
import { defineStore } from 'pinia';
import { OwnerUser } from 'df-shared/src/models/OwnerUser';
import i18n from '../i18n';
import AuthService from '../components/auth/AuthService';
import keycloak from '../plugin/keycloak';
import OwnerService from '../components/account/OwnerService';

interface State {
  user: User;
  status: { loggedIn: boolean };
  footer: boolean;
  properties: Property[];
  propertyToEdit: Property;
  propertyToConsult: Property;
}

function defaultState(): State {
  const ownerState: State = {
    user: new User(),
    status: { loggedIn: false },
    footer: true,
    properties: [],
    propertyToEdit: new Property(),
    propertyToConsult: new Property(),
  };
  return ownerState;
}

const localStore = localStorage.getItem('store');
const initialStore = defaultState();
if (localStore !== null) {
  Object.assign(initialStore, JSON.parse(localStore));
}
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL?.toString()}`;

const useOwnerStore = defineStore('owner', {
  state: (): State => ({ ...initialStore }),
  getters: {
    getUser: (state: State) => state.user,
    isLoggedIn: () => keycloak.authenticated,
    hasFooter: (state: State) => state.footer,
    getProperties: (state: State) => state.properties,
    getPropertyToEdit: (state: State): Property => state.propertyToEdit,
    getPropertyToConsult: (state: State) => state.propertyToConsult,
  },
  actions: {
    initState() {
      Object.assign(this, defaultState());
    },
    setHasFooter(hasFooter: boolean) {
      this.footer = hasFooter;
    },
    loadUserCommit(owner: OwnerUser) {
      Object.assign(this.user, owner);
      this.properties = owner.properties || [];
      Object.assign(this.status.loggedIn, true);
    },
    logoutCommit() {
      Object.assign(this.status.loggedIn, false);
      Object.assign(this.user, {});
    },
    setLastName(lastName: string) {
      this.user.lastName = lastName;
    },
    setFirstName(firstName: string) {
      this.user.firstName = firstName;
    },
    setEmail(email: string) { Object.assign(this.user.email, email); },
    setName(name: string) {
      this.propertyToEdit.name = name;
    },
    setType(type: string) {
      this.propertyToEdit.type = type;
    },
    setAddress(address: string) {
      this.propertyToEdit.address = address;
    },
    setFurniture(furniture: string) {
      this.propertyToEdit.furniture = furniture;
    },
    setRent(rent: number) {
      this.propertyToEdit.rentCost = rent;
    },
    setCharges(charges: number) {
      this.propertyToEdit.chargesCost = charges;
    },
    updatePropertyToEdit(id: number) {
      const prop = this.properties.find((p) => p.id === id);
      if (prop) {
        Object.assign(this.propertyToEdit, { ...prop });
      }
    },
    updatePropertyToConsult(id: number) {
      const prop = this.properties.find((p) => p.id === id);
      if (prop) {
        Object.assign(this.propertyToConsult, { ...prop });
      }
    },
    setPropertyToEdit(property: Property) {
      this.propertyToEdit = { ...property };
    },
    setPropertyValidated(validated: boolean) {
      this.propertyToEdit.validated = validated;
    },
    setLang(lang: string) {
      (i18n.global as unknown as Composer).locale.value = lang;
      const html = document.documentElement;
      html.setAttribute('lang', (i18n.global as unknown as Composer).locale.value);
      const { cookies } = useCookies();
      const expireTimes = new Date();
      expireTimes.setFullYear(expireTimes.getFullYear() + 1);
      cookies.set('lang', lang, expireTimes, '/', MAIN_URL.endsWith('dossierfacile.fr') ? 'dossierfacile.fr' : 'localhost');
    },
    registerSuccess() {
      this.status.loggedIn = false;
      this.user = new User();
    },
    registerFailure() {
      this.status.loggedIn = false;
      this.user = new User();
    },
    register(user: User) {
      return AuthService.register(user).then(
        (response) => {
          this.registerSuccess();
          return Promise.resolve(response.data);
        },
        (error) => {
          this.registerFailure();
          return Promise.reject(error);
        },
      );
    },
    loadUser() {
      return AuthService.loadUser().then(
        (response: any) => {
          this.loadUserCommit(response.data);
          return Promise.resolve(response.data);
        },
        (error: any) => Promise.reject(error),
      );
    },
    logout(redirect = true) {
      return AuthService.logout()
        .then(async () => {
          await this.logoutCommit();
          await this.initState();
          if (redirect) {
            window.location.replace(MAIN_URL);
            return;
          }
          window.location.reload();
        })
        .catch(() => {
          window.location.reload();
        });
    },
    resetPassword(user: User) {
      return AuthService.resetPassword(user).then(
        (u) => Promise.resolve(u),
        (error) => Promise.reject(error),
      );
    },
    changePassword(user: User) {
      return AuthService.changePassword(user).then(
        async (response) => {
          await this.loadUserCommit(response.data);
          return Promise.resolve(user);
        },
        (error) => Promise.reject(error),
      );
    },
    saveNames(lastName: string, firstName: string, email: string) {
      return OwnerService.saveNames(lastName, firstName, email).then((response) => {
        this.loadUserCommit(response.data);
        return Promise.resolve(response.data);
      });
    },
    saveProperty() {
      return OwnerService.saveProperty(this.propertyToEdit).then((response) => {
        this.setPropertyToEdit(response.data);
        return Promise.resolve(response.data);
      });
    },
    newProperty() {
      return this.setPropertyToEdit(new Property());
    },
    deleteProperty(id: number) {
      return OwnerService.deleteProperty(id).then(async (response) => {
        await this.loadUserCommit(response.data);
        return Promise.resolve(response.data);
      });
    },
    deleteAccount() {
      return AuthService.deleteAccount();
    },
  },
});

export default useOwnerStore;
