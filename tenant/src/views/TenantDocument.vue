<template>
  <ProfileContainer :step="2">
    <UploadDocuments :substep="getStep()"></UploadDocuments>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadDocuments from "../components/UploadDocuments.vue";
import ProfileContainer from "../components/ProfileContainer.vue";

@Component({
  components: {
    UploadDocuments,
    ProfileContainer,
  },
})
export default class TenantDocument extends Vue {
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
