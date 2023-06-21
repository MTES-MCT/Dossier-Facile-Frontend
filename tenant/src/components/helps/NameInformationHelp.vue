<template>
  <div class="fr-alert fr-alert--info fr-mb-1w">
    <p v-if="isFranceConnected">
      {{ $t("nameinformationhelp.info-fc") }}
      <a href="#" @click="updateInformation">
        {{ $t("nameinformationhelp.unlink-fc") }}</a
      >.
    </p>
    <p v-else>
      {{ $t("nameinformationhelp.info") }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters({
      isFranceConnected: "isFranceConnected",
    }),
  },
})
export default class NameInformationHelp extends Vue {
  isFranceConnected!: boolean;

  updateInformation() {
    this.$emit("updateInformation");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
