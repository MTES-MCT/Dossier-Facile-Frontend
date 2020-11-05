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

    <Modal v-show="isModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="rf-container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8">
              <p>
                Afin de créer votre compte, nous avons besoin de quelques
                informations. Vous êtes…<br />
              </p>
              <div class="row">
                <div class="col-md-6">
                  <button
                    class="btn btn--primary"
                    type="submit"
                    @click="registerTenant"
                  >
                    Locataire
                  </button>
                </div>
                <div class="col-md-6">
                  <button class="btn btn--primary" type="submit">
                    Propriétaire
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
import { mapState } from "vuex";
import $ from "jquery";
import Modal from "df-shared/src/components/Modal.vue";

@Component({
  components: {
    MyHeader,
    MyFooter,
    Menu,
    Modal
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
  isModalVisible = false;

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
    this.isModalVisible = true;
  }
  closeModal() {
    this.isModalVisible = false;
  }

  registerTenant() {
    window.location.href = "http://localhost:9002/signup";
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
