<template>
  <ProfileContainer :step="step">
    <TenantGuarantorDocuments :substep="getStep()"></TenantGuarantorDocuments>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TenantGuarantorDocuments from "../components/TenantGuarantorDocuments.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { mapGetters } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: {
    TenantGuarantorDocuments,
    ProfileContainer
  },
  computed: {
    ...mapGetters({
      guarantors: "guarantors"
    })
  }
})
export default class GuarantorDocumentsPage extends Vue {
  @Prop() step!: number;
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

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
