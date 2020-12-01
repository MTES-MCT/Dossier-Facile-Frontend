<template>
  <div id="app">
    <header class="rf-header">
      <div class="rf-container">
        <MyHeader
          v-on:on-login="onLogin"
          v-on:on-create-account="onCreateAccount"
        />
        <Menu />
      </div>
    </header>
    <router-view />
    <MyFooter />
    <Cookies :hidden="cookieHidden" v-on:hide-cookie="hideCookie" />

    <Modal v-show="isCreateModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="rf-container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8">
              <p>
                {{ $t("register-information") }}
              </p>
              <div class="row">
                <div class="col-md-6">
                  <button
                    class="btn btn--primary"
                    type="submit"
                    @click="registerTenant"
                  >
                    {{ $t("tenant") }}
                  </button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn--primary" type="submit">
                    {{ $t("owner") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <Modal v-show="isLoginModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="rf-container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8">
              <p>
                {{ $t("login-choice") }}
              </p>
              <div class="row">
                <div class="col-md-6">
                  <button
                    class="btn btn--primary"
                    type="submit"
                    @click="loginTenant"
                  >
                    {{ $t("tenant") }}
                  </button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn--primary" type="submit">
                    {{ $t("owner") }}
                  </button>
                </div>
              </div>
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
import Modal from "df-shared/src/components/Modal.vue";
import Cookies from "df-shared/src/Footer/Cookies.vue";

@Component({
  components: {
    MyHeader,
    MyFooter,
    Menu,
    Modal,
    Cookies
  }
})
export default class App extends Vue {
  isCreateModalVisible = false;
  isLoginModalVisible = false;
  cookieHidden = this.$cookies.isKey("accept-cookie")
    ? this.$cookies.get("accept-cookie")
    : false;

  onLogin() {
    this.isLoginModalVisible = true;
  }
  onCreateAccount() {
    this.isCreateModalVisible = true;
  }
  closeModal() {
    this.isCreateModalVisible = false;
    this.isLoginModalVisible = false;
  }

  loginTenant() {
    window.location.href = "http://localhost:9002/login";
  }
  registerTenant() {
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
"login-choice": "Choisissez votre mode de connexion :",
"tenant": "Locataire",
"owner": "Propriétaire",
"register-information": "Afin de créer votre compte, nous avons besoin de quelques informations. Vous êtes…"
},
"fr": {
"login-choice": "Choisissez votre mode de connexion :",
"tenant": "Locataire",
"owner": "Propriétaire",
"register-information": "Afin de créer votre compte, nous avons besoin de quelques informations. Vous êtes…"
}
}
</i18n>
