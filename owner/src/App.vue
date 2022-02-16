<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";
import MyHeader from "df-shared/src/Header/Header.vue";
import TheFooter from "df-shared/src/Footer/Footer.vue";
import Menu from "./components/Menu.vue";
import Cookies from "df-shared/src/Footer/Cookies.vue";
import { useRouter } from "vue-router";

defineProps<{}>();

const OWNER_URL = `//${import.meta.env.VUE_APP_OWNER_URL}`;
const MAIN_URL = `//${import.meta.env.VUE_APP_MAIN_URL}`;
const TENANT_URL = `//${import.meta.env.VUE_APP_TENANT_URL}`;

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.getters.isLoggedIn);
const isFunnel = computed(() => store.getters.isFunnel);

// TODO add cookie
// let cookieHidden = this.$cookies.isKey("accept-cookie");
let cookieHidden = false;
let isDeleteModalVisible = false;

function onCreateTenant() {
  window.location.href = TENANT_URL;
}

function onCreateOwner() {
  router.push("/signup");
}

function onLogout() {
  store.dispatch("logout", MAIN_URL);
}

function changeLang() {
  // TODO add i18n
  // const lang = i18n.locale === "fr" ? "en" : "fr";
  // store.dispatch("setLang", lang);
}

function getLang() {
  // TODO add i18n
  // return i18n.locale;
  return "fr";
}

  function acceptCookies() {
    // TODO FIXME cookies
    // const aYearFromNow = new Date();
    // aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    // this.$cookies.set(
    //   "accept-cookie",
    //   true,
    //   aYearFromNow,
    //   "",
    //   this.MAIN_URL.endsWith("dossierfacile.fr")
    //     ? "dossierfacile.fr"
    //     : "localhost"
    // );
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
    // this.cookieHidden = true;
  }

  function denyCookies() {
    // TODO FIXME cookies
    // const d = new Date();
    // d.setDate(d.getDate() + 1);
    // this.$cookies.set(
    //   "accept-cookie",
    //   false,
    //   d.toUTCString(),
    //   "",
    //   this.MAIN_URL.endsWith("dossierfacile.fr")
    //     ? "dossierfacile.fr"
    //     : "localhost"
    // );
    // this.cookieHidden = true;
  }
</script>

<template>
  <!-- <MyHeader
    :logged-in="isLoggedIn"
    @on-create-tenant="onCreateTenant"
    @on-create-owner="onCreateOwner"
    @on-logout="onLogout"
    @on-change-lang="changeLang"
    :showAccessibility="false"
    :lang="getLang()"
  >
    <Menu />
  </MyHeader> -->
  <article class="page">
    <router-view :key="$route.path" />
  </article>
  <!-- <TheFooter v-if="!isFunnel" /> -->
  <!-- <Cookies :hidden="cookieHidden" @accept="acceptCookies" @deny="denyCookies" /> -->
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
