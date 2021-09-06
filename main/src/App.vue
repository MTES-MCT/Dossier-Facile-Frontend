<template>
  <div id="app">
    <MyHeader
      @on-create-tenant="onCreateTenant"
      @on-create-owner="onCreateOwner"
      @on-change-lang="changeLang"
      :lang="getLang()"
    >
    </MyHeader>
    <router-view />
    <MyFooter />
    <Cookies
      :hidden="cookieHidden"
      @accept="acceptCookies"
      @deny="denyCookies"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import MyFooter from "df-shared/src/Footer/Footer.vue";
import Modal from "df-shared/src/components/Modal.vue";
import Cookies from "df-shared/src/Footer/Cookies.vue";
import i18n from "./i18n";
import VueGtag from "vue-gtag";
import router from "./router";

@Component({
  components: {
    MyHeader,
    MyFooter,
    Modal,
    Cookies
  }
})
export default class App extends Vue {
  cookieHidden = this.$cookies.isKey("accept-cookie");

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;
  REGISTER_URL = process.env.VUE_APP_REGISTER_URL || "";

  mounted() {
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/dsfr.module.min.js");
    document.head.appendChild(localScript);
  }

  onCreateOwner() {
    window.location.href = this.OWNER_URL;
  }

  onCreateTenant() {
    window.location.replace(`${this.TENANT_URL}/signup`);
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
              "proprietaire.dossierfacile.fr",
              "sso.dossierfacile.fr"
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

  isMobile() {
    return window.innerWidth < 768;
  }

  changeLang() {
    const lang = i18n.locale === "fr" ? "en" : "fr";
    this.$store.dispatch("setLang", lang);
  }

  getLang() {
    return i18n.locale;
  }
}
</script>

<style lang="scss">
@import "df-shared/src/scss/_main.scss";

a {
  box-shadow: none !important;
}

// style hack to handle both themeforest and gouvfr design system
.bullets {
  li {
    &::marker {
      content: none;
    }
  }
}
.tabs-content,
.tabs,
.flickity-page-dots {
  li {
    &:before {
      content: none;
    }
  }
}
</style>

<i18n>
{
"en": {
"tenant": "Tenant",
"owner": "Owner",
"register-information": "In order to create your account, we need some information. You are…",
"faq": "FAQ"
},
"fr": {
"tenant": "Locataire",
"owner": "Propriétaire",
"register-information": "Afin de créer votre compte, nous avons besoin de quelques informations. Vous êtes…",
"faq": "FAQ"
}
}
</i18n>
