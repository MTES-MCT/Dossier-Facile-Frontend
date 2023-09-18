<template>
  <ProfileContainer :step="getStep()">
    <ValidateFile @on-back="goBack"></ValidateFile>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ValidateFile from "../components/ValidateFile.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    ValidateFile,
    ProfileContainer,
  },
  computed: {
    ...mapState({
      user: "user",
      coTenants: "coTenants",
    }),
  },
})
export default class ValidateFilePage extends Vue {
  user!: User;
  coTenants!: User[];

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  getStep() {
    return Number(this.$route.params.step) || 4;
  }
  getLastCoTenantId() {
    return this.coTenants[Number(this.coTenants.length) - 1].id;
  }
  goBack() {
    if (this.getStep() == 6) {
      this.$router.push({
        name: "TenantGuarantors",
        params: {
          tenantId: this.getLastCoTenantId().toString(),
          step: (this.getStep() - 1).toString(),
        },
      });
    } else {
      if (
        this.user.guarantors === undefined ||
        this.user.guarantors.length === 0
      ) {
        this.$router.push({ name: "GuarantorChoice" });
        return;
      }
      this.$router.push({
        name: "GuarantorList",
      });
      return;
    }
  }
}
</script>
