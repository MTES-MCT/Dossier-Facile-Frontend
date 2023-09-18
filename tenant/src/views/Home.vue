<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
})
export default class Home extends Vue {
  isLoggedIn!: boolean;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;

  mounted() {
    this.$nextTick(function () {
      window.stop();
      if (this.isLoggedIn) {
        window.location.replace(`${this.TENANT_URL}/account`);
      } else {
        window.location.replace(this.MAIN_URL);
      }
      return;
    });
  }
}
</script>
