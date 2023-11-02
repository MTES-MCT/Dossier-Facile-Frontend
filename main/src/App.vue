<template>
  <div id="app">
    <SkipLinks></SkipLinks>
    <MyHeader
      @on-login-tenant="onLoginTenant"
      @on-create-owner="onCreateOwner"
      :lang="getLang()"
    >
      <Menu />
    </MyHeader>
    <div id="content">
      <Announcement></Announcement>
      <main class="page" role="main">
        <router-view />
        <FollowSocials />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import Footer from "df-shared/src/Footer/Footer.vue";
import FollowSocials from "df-shared/src/Footer/FollowSocials.vue";
import Modal from "df-shared/src/components/Modal.vue";
import Announcement from "df-shared/src/components/Announcement.vue";
import SkipLinks from "df-shared/src/components/SkipLinks.vue";
import Menu from "./components/Menu.vue";
import i18n from "./i18n";

@Component({
  components: {
    Modal,
    Announcement,
    MyHeader,
    Menu,
    Footer,
    SkipLinks,
    FollowSocials,
  },
})
export default class App extends Vue {
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  onCreateOwner() {
    window.location.href = this.OWNER_URL;
  }

  onLoginTenant() {
    window.location.replace(`${this.TENANT_URL}/login`);
  }

  getLang() {
    return i18n.locale;
  }
}
</script>

<style lang="scss">
@import "df-shared/src/scss/_main.scss";

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
