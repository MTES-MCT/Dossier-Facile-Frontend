<template>
  <ProfileContainer :step="1">
    <NakedCard class="fr-pt-3w fr-pb-3w">
      <TenantInformationForm></TenantInformationForm>
    </NakedCard>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TenantInformationForm from "@/components/TenantInformationForm.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  components: {
    TenantInformationForm,
    ProfileContainer,
    NakedCard
  }
})
export default class TypeInformation extends Vue {
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
