<template>
  <ProfileContainer :step="1">
    <TenantInformationForm></TenantInformationForm>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TenantInformationForm from "../components/TenantInformationForm.vue";
import ProfileContainer from "../components/ProfileContainer.vue";

@Component({
  components: {
    TenantInformationForm,
    ProfileContainer,
  },
})
export default class TypeInformation extends Vue {
  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }
}
</script>
