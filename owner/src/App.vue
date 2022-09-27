<script setup lang="ts">
import { computed, ref } from 'vue';
import MyHeader from 'df-shared-next/src/Header/Header.vue';
import Announcement from 'df-shared-next/src/components/Announcement.vue';
import TheFooter from 'df-shared-next/src/Footer/Footer.vue';
import Cookies from 'df-shared-next/src/Footer/Cookies.vue';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { Composer } from 'vue-i18n';
import i18n from './i18n';
import Menu from './components/Menu.vue';
import useOwnerStore from './store/owner-store';

const TENANT_URL = `//${import.meta.env.VITE_TENANT_URL}`;

const store = useOwnerStore();
const router = useRouter();
const { cookies } = useCookies();

const isLoggedIn = computed(() => store.isLoggedIn);

const cookieHidden = ref(cookies.isKey('accept-cookie') && cookies.get('accept-cookie') === 'true');

const hasFooter = computed(() => store.hasFooter);

function onLoginTenant() {
  window.location.href = TENANT_URL;
}

function onCreateOwner() {
  router.push({ name: 'Dashboard' });
}

function onLogout() {
  store.logout(true);
}

function changeLang() {
  const lang = ((i18n.global as unknown) as Composer).locale.value === 'fr' ? 'en' : 'fr';
  store.setLang(lang);
}

function getLang() {
  return ((i18n.global as unknown) as Composer).locale.value;
}

function acceptCookies() {
  cookies.set('accept-cookie', 'true');
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
    @on-login-tenant="onLoginTenant"
    @on-create-owner="onCreateOwner"
    @on-logout="onLogout"
    :showAccessibility="false"
  >
    <Menu @on-change-lang="changeLang" :lang="getLang()"></Menu>
  </MyHeader>
  <Announcement></Announcement>
  <main class="page">
    <router-view />
  </main>
  <div v-if="hasFooter">
    <TheFooter />
  </div>
</template>

<style lang="scss">
@import '../../node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css';
@import 'df-shared-next/src/scss/_main.scss';

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
