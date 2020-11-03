<template>
  <div id="app">
    <header class="rf-header">
      <div class="rf-container">
        <MyHeader
          :user="user"
          :logged-in="status.loggedIn"
          v-on:on-login="onLogin"
          v-on:on-logout="onLogout"
          v-on:on-create-account="onCreateAccount"
        />
        <Menu />
      </div>
    </header>
    <article class="rf-container">
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
import $ from "jquery";

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
  },
  mounted: function() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        $(".background-image-holder").each(function() {
          const imgSrc = $(this)
            .children("img")
            .attr("src");
          $(this)
            .css("background", 'url("' + imgSrc + '")')
            .css("background-position", "initial")
            .css("opacity", "1");
        });
      }
    };
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
    // FIXME open modal to redirect to tenant app

  }
}
</script>

<style lang="scss">
@import "assets/csss/bootstrap4.css";
@import "assets/csss/custom.css";
@import "assets/csss/flickity.css";
@import "assets/csss/iconsmind.css";
@import "assets/csss/socicon.css";
@import "assets/csss/stack-interface.css";
@import "assets/csss/theme.css";

.background-image-holder {
  img {
    opacity: 0;
  }
}

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
