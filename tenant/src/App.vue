<template>
  <div id="app">
    <Cookies
      :hidden="cookieHidden"
      @accept="acceptCookies"
      @deny="denyCookies"
    />
    <TenantSkipLinks></TenantSkipLinks>
    <MyHeader
      :logged-in="isLoggedIn"
      @on-login-tenant="onLoginTenant"
      @on-create-owner="onCreateOwner"
      @on-logout="onLogout"
      @on-change-lang="changeLang"
      :showAccessibility="isFunnel"
      :lang="getLang()"
    >
      <Menu />
    </MyHeader>
    <div id="content">
      <Announcement></Announcement>
      <main class="page" role="main">
        <router-view :key="$route.path" />
      </main>
    </div>
    <TheFooter v-if="!isFunnel" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import TheFooter from "df-shared/src/Footer/Footer.vue";
import Menu from "./components/Menu.vue";
import { mapGetters, mapState } from "vuex";
import i18n from "./i18n";
import Cookies from "df-shared/src/Footer/Cookies.vue";
import VueGtag from "vue-gtag";
import router from "./router";
import Announcement from "df-shared/src/components/Announcement.vue";
import ModalAnnouncement from "df-shared/src/components/ModalAnnouncement.vue";
import TenantSkipLinks from "./components/TenantSkipLinks.vue";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    TenantSkipLinks,
    MyHeader,
    TheFooter,
    Menu,
    Cookies,
    Announcement,
    ModalAnnouncement
  },
  computed: {
    ...mapState({
      user: "user",
      status: "status",
      isFunnel: "isFunnel"
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class App extends Vue {
  isFunnel!: boolean;
  user!: User;
  cookieHidden = this.$cookies.isKey("accept-cookie");
  isLoggedIn!: boolean;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  isCoupleModalVisible = false;

  isCouple() {
    return this.isLoggedIn && this.user.applicationType === "COUPLE";
  }

  onLogout() {
    this.$store.dispatch("logout", this.MAIN_URL);
  }

  onLoginTenant() {
    this.$router.push("/login");
  }

  onCreateOwner() {
    window.location.href = this.OWNER_URL;
  }

  getLang() {
    return i18n.locale;
  }

  changeLang() {
    const lang = i18n.locale === "fr" ? "en" : "fr";
    this.$store.dispatch("setLang", lang);
  }

  acceptCookies() {
    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    this.$cookies.set(
      "accept-cookie",
      true,
      aYearFromNow,
      "",
      this.MAIN_URL.endsWith("dossierfacile.fr")
        ? "dossierfacile.fr"
        : "localhost"
    );

    Vue.use(
      VueGtag,
      {
        config: {
          id: "UA-50823626-2",
          params: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            send_page_view: true
          },
          linker: {
            domains: [
              "dossierfacile.fr",
              "www.dossierfacile.fr",
              "locataire.dossierfacile.fr",
              "proprietaire.dossierfacile.fr",
              "sso.dossierfacile.fr"
            ]
          }
        }
      },
      router
    );
    Vue.prototype.inspectlet();
    Vue.prototype.iphub();
    this.cookieHidden = true;
  }

  denyCookies() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    this.$cookies.set(
      "accept-cookie",
      false,
      d.toUTCString(),
      "",
      this.MAIN_URL.endsWith("dossierfacile.fr")
        ? "dossierfacile.fr"
        : "localhost"
    );
    this.cookieHidden = true;
  }
}
</script>

<style lang="scss">
@import "df-shared/src/scss/_main.scss";

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#content {
  flex: auto;
  display: flex;
  flex-direction: column;
}

.page {
  flex: auto;
  min-height: 300px;
  display: flex;
  align-items: stretch;
}
</style>

