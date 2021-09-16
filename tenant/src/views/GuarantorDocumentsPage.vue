<template>
  <ProfileContainer :step="3">
    <GuarantorDocuments :substep="getStep()"></GuarantorDocuments>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuarantorDocuments from "@/components/GuarantorDocuments.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";

@Component({
  components: {
    GuarantorDocuments,
    ProfileContainer
  }
})
export default class GuarantorDocumentsPage extends Vue {
  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/dsfr.module.min.js");
    document.head.appendChild(localScript);
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
