<template>
  <div id="app">
    <header class="rf-header">
      <div class="rf-container">
        <MyHeader
          :logged-in="status.loggedIn"
          @on-create-tenant="onCreateTenant"
          @on-create-owner="onCreateOwner"
          @on-logout="onLogout"
        />
        <Menu :user="user" />
      </div>
    </header>
    <div class="change-lang">
      <button :class="rf-btn" @click="changeLang">
        {{ getLang() }}
      </button>
    </div>
    <article class="page">
      <router-view />
    </article>
    <MyFooter />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import MyFooter from "df-shared/src/Footer/Footer.vue";
import Menu from "@/components/Menu.vue";
import { mapState } from "vuex";
import i18n from '@/i18n';

@Component({
  components: {
    MyHeader,
    MyFooter,
    Menu
  },
  computed: {
    ...mapState({
      user: "user",
      status: "status"
    })
  }
})
export default class App extends Vue {
  onLogin() {
    this.$router.push("/login");
  }
  onLogout() {
    this.$store.dispatch("logout").then(
      () => {
        console.log("logged out !");
      },
      error => {
        console.dir(error);
      }
    );
  }
  onCreateTenant() {
    this.$router.push("/signup");
  }

  onCreateOwner() {
    window.location.href = "http://localhost:9003/signup";
  }
  getLang() {
    return i18n.locale;
  }
  changeLang() {
    const lang = i18n.locale === "fr" ? "en" : "fr";
    this.$store.dispatch("setLang", lang);
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

.change-lang {
  position: absolute;
  right: 30px;
  top: 330px;
}
</style>

<i18n>
{
"en": {
"home": "Home"
},
"fr": {
"home": "Home"
}
}
</i18n>
