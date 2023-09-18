<template>
  <ProfileContainer :step="getStep()">
    <div v-show="!guarantors || guarantors.length == 0">
      <TenantGuarantorChoice
        :tenantId="getTenantId()"
        :isCotenant="true"
        @on-back="goBack"
        @on-select="updateGuarantorType"
      ></TenantGuarantorChoice>
    </div>

    <div v-show="guarantors && guarantors.length > 0">
      <TenantGuarantorList
        :guarantors="guarantors"
        :substep="getStep()"
        @on-edit="onEdit"
        @on-back="goBack"
        @on-next="goNext"
      ></TenantGuarantorList>
    </div>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TenantGuarantorChoice from "../components/TenantGuarantorChoice.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { mapGetters } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import TenantGuarantorDocuments from "../components/TenantGuarantorDocuments.vue";
import TenantGuarantorList from "./TenantGuarantorList.vue";
import { User } from "df-shared/src/models/User";
import TenantGuarantorName from "../components/documents/naturalGuarantor/TenantGuarantorName.vue";
import OrganismCert from "../components/documents/organismGuarantor/OrganismCert.vue";
import GuarantorFooter from "../components/footer/GuarantorFooter.vue";
import CorporationIdentification from "../components/documents/legalPersonGuarantor/CorporationIdentification.vue";

@Component({
  components: {
    TenantGuarantorName,
    TenantGuarantorChoice,
    TenantGuarantorList,
    TenantGuarantorDocuments,
    ProfileContainer,
    OrganismCert,
    CorporationIdentification,
    GuarantorFooter,
  },
  computed: {
    ...mapGetters({
      coTenants: "coTenants",
    }),
  },
})
export default class TenantGuarantorsPage extends Vue {
  coTenants!: User[];
  guarantors?: Guarantor[] = [];

  @Watch("coTenants")
  protected onCotenantsChange(): any {
    this.guarantors =
      this.coTenants.find((t) => {
        return t.id === Number(this.$route.params.tenantId);
      })?.guarantors || [];
  }

  beforeMount() {
    this.onCotenantsChange();
  }

  getStep() {
    return Number(this.$route.params.step) || 0;
  }

  getTenantId(): number {
    return Number(this.$route.params.tenantId);
  }

  onEdit(g: Guarantor) {
    this.$router.push({
      name: "TenantGuarantorDocuments",
      params: {
        step: this.getStep().toString(),
        substep: "0",
        tenantId: this.getTenantId().toString(),
        guarantorId: g.id?.toString() as string,
      },
    });
  }

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  updateGuarantorType(value: string) {
    if (value == "NO_GUARANTOR") {
      this.goNext();
    } else {
      if (this.guarantors === undefined) {
        return;
      }

      this.$router.push({
        name: "TenantGuarantorDocuments",
        params: {
          step: this.getStep().toString(),
          substep: "0",
          tenantId: this.getTenantId().toString(),
          guarantorId: this.guarantors[0].id?.toString() || "0",
        },
      });
    }
  }

  goBack() {
    this.$router.push({
      name: "CoTenantDocuments",
      params: {
        step: "4",
        substep: "5",
        tenantId: this.getTenantId().toString(),
      },
    });
  }

  goNext() {
    this.$router.push({
      name: "ValidateFileStep",
      params: { step: Number(this.getStep() + 1).toString() },
    });
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
