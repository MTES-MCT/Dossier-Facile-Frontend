<template>
  <ProfileContainer :step="4">
    <ValidateFile></ValidateFile>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ValidateFile from "@/components/ValidateFile.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";

@Component({
  components: {
    ValidateFile,
    ProfileContainer
  }
})
export default class ValidateFilePage extends Vue {
  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/dsfr.module.min.js");
    document.head.appendChild(localScript);
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }
}
</script>
