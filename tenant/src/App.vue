<template>
  <div id="app">
    <TenantSkipLinks></TenantSkipLinks>
    <MyHeader
      :logged-in="isLoggedIn"
      @on-login-tenant="onLoginTenant"
      @on-create-owner="onCreateOwner"
      @on-logout="onLogout"
      :showAccessibility="isFunnel"
    >
      <Menu />
    </MyHeader>
    <div id="content">
      <DeleteAccount></DeleteAccount>
      <Announcement></Announcement>
      <main role="main">
        <div>
          <router-view class="page" :key="$route.path" />
        </div>
        <FollowSocials />
      </main>
    </div>
    <Footer v-if="!isFunnel" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import Footer from "df-shared/src/Footer/Footer.vue";
import Menu from "./components/Menu.vue";
import { mapGetters, mapState } from "vuex";
import Announcement from "df-shared/src/components/Announcement.vue";
import ModalAnnouncement from "df-shared/src/components/ModalAnnouncement.vue";
import TenantSkipLinks from "./components/TenantSkipLinks.vue";
import { User } from "df-shared/src/models/User";
import DeleteAccount from "./components/DeleteAccount.vue";
import FollowSocials from "../../df-shared/src/Footer/FollowSocials.vue";

@Component({
  components: {
    DeleteAccount,
    TenantSkipLinks,
    MyHeader,
    Footer,
    Menu,
    Announcement,
    ModalAnnouncement,
    FollowSocials,
  },
  computed: {
    ...mapState({
      user: "user",
      status: "status",
      isFunnel: "isFunnel",
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
})
export default class App extends Vue {
  isFunnel!: boolean;
  user!: User;
  isLoggedIn!: boolean;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;

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
