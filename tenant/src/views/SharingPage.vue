<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-my-5w">
        <h1 class="fr-h4">{{ $t("sharing-page.title") }}</h1>
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
          <NakedCard class="fr-px-md-3w fr-py-md-4w" v-if="displayShareBloc()">
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
import { UtilsService } from "@/services/UtilsService";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    SharedLinks,
    ShareFile,
    NakedCard,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class SharingPage extends Vue {
  user!: User;

  beforeMount() {
    this.$store.dispatch("loadApartmentSharingLinks");
  }

  displayShareBloc() {
    return UtilsService.canShareFile(this.user);
  }
}
</script>

<style scoped lang="scss"></style>