<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class Home extends Vue {
  isLoggedIn!: boolean;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;

  mounted() {
    if (this.isLoggedIn) {
      window.location.replace(`${this.TENANT_URL}/account`);
    } else {
      console.dir(this.MAIN_URL);
      window.location.href = `https://${this.MAIN_URL}`;
    }
    return;
  }
}
</script>
