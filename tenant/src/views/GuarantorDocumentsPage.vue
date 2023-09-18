<template>
  <ProfileContainer :step="3">
    <GuarantorDocuments :substep="getStep()"></GuarantorDocuments>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuarantorDocuments from "../components/GuarantorDocuments.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { mapGetters } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: {
    GuarantorDocuments,
    ProfileContainer,
  },
  computed: {
    ...mapGetters({
      guarantors: "guarantors",
    }),
  },
})
export default class GuarantorDocumentsPage extends Vue {
  guarantors!: Guarantor[];

  async beforeMount() {
    if (this.$route.params.guarantorId) {
      const g = this.guarantors.find((g: Guarantor) => {
        return g.id?.toString() == this.$route.params.guarantorId;
      });
      await this.$store.commit("setSelectedGuarantor", g);
    }
  }

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  getStep() {
    return Number(this.$route.params.substep) || 0;
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
