<template>
  <ProfileContainer :step="getStep()">
    <div v-if="!guarantors || guarantors.length == 0">
      <TenantGuarantorChoice
        :tenantId="getTenantId()"
        @on-back="goBack"
        @on-select="updateGuarantorType"
      ></TenantGuarantorChoice>
    </div>
    <TenantGuarantorName
      v-else-if="editName"
      :tenantId="getTenantId()"
      :guarantor="selectedGuarantor"
      @on-back="() => (editName = false)"
      @on-next="goNext"
    ></TenantGuarantorName>
    <TenantGuarantorList
      v-else
      :guarantors="guarantors"
      :substep="getStep()"
      @on-edit="onEdit"
      @on-delete="onDelete"
      @on-back="goBack"
      @on-next="goNext"
    ></TenantGuarantorList>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TenantGuarantorChoice from "../components/TenantGuarantorChoice.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { mapGetters } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import TenantGuarantorDocuments from "../components/TenantGuarantorDocuments.vue";
import TenantGuarantorList from "./TenantGuarantorList.vue";
import { User } from "df-shared/src/models/User";
import TenantGuarantorName from "../components/documents/naturalGuarantor/TenantGuarantorName.vue";

@Component({
  components: {
    TenantGuarantorName,
    TenantGuarantorChoice,
    TenantGuarantorList,
    TenantGuarantorDocuments,
    ProfileContainer
  },
  computed: {
    ...mapGetters({
      coTenants: "coTenants"
    })
  }
})
export default class TenantGuarantorsPage extends Vue {
  coTenants!: User[];
  guarantors?: Guarantor[] = [];
  selectedGuarantor?: Guarantor;
  editName = false;

  getStep() {
    return Number(this.$route.params.step) || 0;
  }
  getTenantId(): number {
    return Number(this.$route.params.tenantId);
  }

  beforeMount() {
    this.refresh();
  }
  refresh() {
    const guarantors = this.coTenants.find(t => {
      return t.id === this.getTenantId();
    })?.guarantors;
    if (guarantors && guarantors.length > 0) {
      this.guarantors = guarantors;
    }
    this.selectedGuarantor = this.getSelectedGuarantor();
  }

  onEdit(g: Guarantor) {
    this.editName = true;
    console.log(g);
    this.selectedGuarantor = g;
  }
  onDelete() {
    this.editName = false;
    this.guarantors = this.coTenants.find(t => {
      return t.id === this.getTenantId();
    })?.guarantors;
  }

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  getSelectedGuarantor() {
    if (this.guarantors && this.guarantors.length > 0) {
      return (this.selectedGuarantor = this.guarantors[
        this.guarantors?.length - 1
      ]);
    }
    return new Guarantor();
  }

  updateGuarantorType(value: string) {
    console.log("value=" + value);

    if (value == "NO_GUARANTOR") {
      this.goNext();
    } else {
      // try to get the new created guarantor // PofS
      this.guarantors = this.coTenants.find(t => {
        return t.id === this.getTenantId();
      })?.guarantors;

      if (this.guarantors && this.guarantors.length > 0) {
        this.selectedGuarantor = this.guarantors[this.guarantors?.length - 1];
      }
      this.editName = true;
    }
  }

  goBack() {
    this.$router.push({
      name: "CoTenantDocuments",
      params: {
        step: "4",
        substep: "5",
        tenantId: this.getTenantId().toString()
      }
    });
  }

  goNext() {
    if (this.editName == true) {
      this.$router.push({
        name: "TenantGuarantorDocuments",
        params: {
          step: this.getStep().toString(),
          substep: "1",
          tenantId: this.getTenantId().toString(),
          guarantorId: this.selectedGuarantor?.id?.toString() as string
        }
      });
    } else {
      console.log(Number(this.getStep() + 1));
      // If "NO_GUARANTOR" next step
      this.$router.push({
        name: "ValidateFileStep",
        params: { step: Number(this.getStep() + 1).toString() }
      });
    }
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
