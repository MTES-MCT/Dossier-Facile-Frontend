<script setup lang="ts">
import { computed, ref } from 'vue';
import MyHeader from 'df-shared/src/Header/Header.vue';
import TheFooter from 'df-shared/src/Footer/Footer.vue';
import Cookies from 'df-shared/src/Footer/Cookies.vue';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import i18n from './i18n';
import Menu from './components/Menu.vue';
import { Composer } from 'vue-i18n';
import useOwnerStore from './store/owner-store';

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;
const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`;

const store = useOwnerStore();
const router = useRouter();
const { cookies } = useCookies();

const isLoggedIn = computed(() => store.isLoggedIn);

const cookieHidden = ref(cookies.isKey('accept-cookie') && cookies.get('accept-cookie') === 'true');

const hasFooter = computed(() => store.hasFooter);

function onCreateTenant() {
  window.location.href = TENANT_URL;
}

function onCreateOwner() {
  router.push('/signup');
}

function onLogout() {
  store.logout(true);
}

function changeLang() {
  const lang = (i18n.global as unknown as Composer).locale.value === 'fr' ? 'en' : 'fr';
  store.setLang(lang);
}

function getLang() {
  return (i18n.global as unknown as Composer).locale.value;
}

function acceptCookies() {
  cookies.set('accept-cookie', 'true');

    // Vue.use(
    //   VueGtag,
    //   {
    //     config: {
    //       id: "UA-50823626-2",
    //       params: {
    //         // eslint-disable-next-line @typescript-eslint/camelcase
    //         send_page_view: true
    //       },
    //       linker: {
    //         domains: [
    //           "dossierfacile.fr",
    //           "www.dossierfacile.fr",
    //           "locataire.dossierfacile.fr",
    //           "proprietaire.dossierfacile.fr",
    //           "sso.dossierfacile.fr"
    //         ]
    //       }
    //     }
    //   },
    //   router
    // );
    // Vue.prototype.inspectlet();

  cookieHidden.value = true;
}

function denyCookies() {
  cookies.set('accept-cookie', 'false');
  cookieHidden.value = true;
}
</script>

<template>
  <Cookies :hidden="cookieHidden" @accept="acceptCookies" @deny="denyCookies" />
  <MyHeader
    :logged-in="isLoggedIn"
    @on-create-tenant="onCreateTenant"
    @on-create-owner="onCreateOwner"
    @on-logout="onLogout"
    @on-change-lang="changeLang"
    :showAccessibility="false"
    :lang="getLang()"
  >
    <Menu />
  </MyHeader>
  <article class="page">
    <router-view />
  </article>
  <div v-if="hasFooter">
    <TheFooter />
  </div>
</template>

<style lang="scss">
@import "../../node_modules/@gouvfr/dsfr/dist/dsfr.min.css";
@import "df-shared/src/scss/_main.scss";

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  background-color: #f5f5fe;
  flex: auto;
  min-height: 300px;
  display: flex;
  align-items: stretch;
}
</style>
