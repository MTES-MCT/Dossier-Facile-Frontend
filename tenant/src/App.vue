<template>
  <div id="app">
    <header class="rf-header">
      <div class="rf-container">
        <MyHeader
          :logged-in="status.loggedIn"
          @on-login="onLogin"
          @on-logout="onLogout"
          @on-create-account="onCreateAccount"
        />
        <Menu :user="user" />
      </div>
    </header>
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
  onCreateAccount() {
    this.$router.push("/signup");
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
"home": "Home"
},
"fr": {
"home": "Home"
}
}
</i18n>
