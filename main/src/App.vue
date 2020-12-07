<template>
  <div id="app">
    <header class="rf-header">
      <div class="rf-container">
        <MyHeader
          @on-create-tenant="onCreateTenant"
          @on-create-owner="onCreateOwner"
        />
        <Menu />
      </div>
    </header>
    <router-view />
    <MyFooter />
    <Cookies :hidden="cookieHidden" @hide-cookie="hideCookie" />

  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import MyFooter from "df-shared/src/Footer/Footer.vue";
import Menu from "@/components/Menu.vue";
import Modal from "df-shared/src/components/Modal.vue";
import Cookies from "df-shared/src/Footer/Cookies.vue";

@Component({
  components: {
    MyHeader,
    MyFooter,
    Menu,
    Modal,
    Cookies
  },
  mounted: function () {
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/all.js");
    document.head.appendChild(localScript);
  }
})
export default class App extends Vue {
  cookieHidden = this.$cookies.isKey("accept-cookie")
    ? this.$cookies.get("accept-cookie")
    : false;

  onCreateOwner() {
    window.location.href = "http://localhost:9003/signup";
  }
  onCreateTenant() {
    window.location.href = "http://localhost:9002/signup";
  }

  hideCookie() {
    this.cookieHidden = true;
    this.$cookies.set(
      "accept-cookie",
      this.cookieHidden,
      new Date(2050, 12, 31).toUTCString()
    );
  }
}
</script>

<style lang="scss">
@import "assets/csss/iconsmind.css";
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
"tenant": "Locataire",
"owner": "Propriétaire",
"register-information": "Afin de créer votre compte, nous avons besoin de quelques informations. Vous êtes…"
},
"fr": {
"tenant": "Locataire",
"owner": "Propriétaire",
"register-information": "Afin de créer votre compte, nous avons besoin de quelques informations. Vous êtes…"
}
}
</i18n>
