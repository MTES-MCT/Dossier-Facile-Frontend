<template>
  <ProfileContainer :step="getStep()">
    <TenantGuarantorDocuments
      :tenantId="tenantId()"
      :guarantorId="guarantorId()"
      :substep="getSubStep()"
      @on-next="goNext"
    ></TenantGuarantorDocuments>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TenantGuarantorDocuments from "../components/TenantGuarantorDocuments.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  components: {
    TenantGuarantorDocuments,
    ProfileContainer,
  },
  computed: {
    ...mapState({
      coTenants: "coTenants",
    }),
  },
})
export default class TenantGuarantorDocumentsPage extends Vue {
  @Prop() step!: number;
  coTenants!: User[];

  beforeMount() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
    const coTenant = this.coTenants.find((r: User) => {
      console.log("tenid=" + r.id + r.firstName);
      return r.id === this.tenantId();
    });
    const guarantor = coTenant?.guarantors?.find((g: Guarantor) => {
      console.log("gid=" + g.id);
      return g.id === this.guarantorId();
    }) as Guarantor;
    this.$store.commit("setSelectedGuarantor", guarantor);
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  getSubStep() {
    return Number(this.$route.params.substep) || 0;
  }
  getStep() {
    return Number(this.$route.params.step) || 0;
  }
  tenantId() {
    return Number(this.$route.params.tenantId) || 0;
  }
  guarantorId() {
    return Number(this.$route.params.guarantorId);
  }
  goNext() {
    this.$router.push({
      name: "TenantGuarantors",
      params: {
        tenantId: this.tenantId().toString(),
        step: this.getStep().toString(),
      },
    });
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
