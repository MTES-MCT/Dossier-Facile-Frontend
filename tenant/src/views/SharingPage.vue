<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-my-5w">
        <h1 class="fr-h4">{{ $t("sharing-page.title") }}</h1>
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
          <NakedCard class="fr-px-md-3w fr-py-md-4w">
            <ShareFile></ShareFile>
          </NakedCard>
          <SharedLinks></SharedLinks>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import ShareFile from "@/components/account/ShareFile.vue";
import SharedLinks from "@/components/SharedLinks.vue";

@Component({
  components: {
    SharedLinks,
    ShareFile,
    NakedCard,
  },
})
export default class SharingPage extends Vue {
  beforeMount() {
    this.$store.dispatch("loadApartmentSharingLinks");
  }
}
</script>

<style scoped lang="scss"></style>