<template>
  <div id="app">
    <header class="rf-header">
      <div class="rf-container">
        <MyHeader
          @on-create-tenant="onCreateTenant"
          @on-create-owner="onCreateOwner"
          @on-change-lang="changeLang"
          :lang="getLang()"
        />
      </div>
      <div class="rf-container">
        <nav class="rf-nav" role="navigation" aria-label="Menu principal">
          <ul class="rf-nav__list">
            <li class="rf-nav__item" v-if="isMobile()">
              <router-link to="/faq" class="rf-link">
                {{ $t("faq") }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
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
import { Header } from "./gouvfr/header.js";
import VueGtag from "vue-gtag";
import router from "./router";

@Component({
  components: {
    MyHeader,
    MyFooter,
    Modal,
    Cookies,
  },
})
export default class App extends Vue {
  cookieHidden = this.$cookies.isKey("accept-cookie")
    ? this.$cookies.get("accept-cookie")
    : false;

  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;

  mounted() {
    new Header();
  }

  onCreateOwner() {
    window.location.href = this.OWNER_URL;
  }

  onCreateTenant() {
    window.location.href = `${this.TENANT_URL}/signup?lang=${this.$i18n.locale}`;
  }

  acceptCookies() {
    this.$cookies.set(
      "accept-cookie",
      this.cookieHidden,
      new Date(2050, 12, 31).toUTCString()
    );
    Vue.use(
      VueGtag,
      {
        config: { id: "UA-50823626-2" },
      },
      router
    );
    this.cookieHidden = true;
  }

  denyCookies() {
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
