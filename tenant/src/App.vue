<template>
  <div id="app">
    <MyHeader
      :logged-in="isLoggedIn"
      @on-create-tenant="onCreateTenant"
      @on-create-owner="onCreateOwner"
      @on-logout="onLogout"
      @on-change-lang="changeLang"
      :lang="getLang()"
    >
      <Menu :user="user" />
    </MyHeader>
    <article class="page">
      <router-view />
    </article>
    <MyFooter />
    <Cookies
      :hidden="cookieHidden"
      @accept="acceptCookies"
      @deny="denyCookies"
    />
    <Modal v-show="IS_MAINTENANCE" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("maintenance") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import MyFooter from "df-shared/src/Footer/Footer.vue";
import Menu from "@/components/Menu.vue";
import { mapGetters, mapState } from "vuex";
import i18n from "./i18n";
import Cookies from "df-shared/src/Footer/Cookies.vue";
import VueGtag from "vue-gtag";
import router from "./router";
import Modal from "df-shared/src/components/Modal.vue";

@Component({
  components: {
    MyHeader,
    MyFooter,
    Menu,
    Cookies,
    Modal
  },
  computed: {
    ...mapState({
      user: "user",
      status: "status"
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class App extends Vue {
  cookieHidden = this.$cookies.isKey("accept-cookie");
  isLoggedIn!: boolean;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  IS_MAINTENANCE = `//${process.env.VUE_APP_MAINTENANCE}`;

  onLogout() {
    this.$store.dispatch("logout", this.MAIN_URL);
  }

  onCreateTenant() {
    this.$router.push("/signup");
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
    this.$cookies.set(
      "accept-cookie",
      true,
      new Date(2050, 12, 31).toUTCString(),
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
          linker: {
            domains: [
              "dossierfacile.fr",
              "www.dossierfacile.fr",
              "locataire.dossierfacile.fr",
              "proprietaire.dossierfacile.fr"
            ]
          }
        }
      },
      router
    );
    Vue.prototype.inspectlet();
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
@import "../node_modules/df-shared/src/scss/_main.scss";

#app {
  min-height: 100vh;
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

<i18n>
{
"en": {
"home": "Home",
"maintenance": "The website is under maintenance, please try again in a few minutes"
},
"fr": {
"home": "Home",
"maintenance": "Le site est en cours de maintenance, veuillez réessayer dans quelques minutes"
}
}
</i18n>
