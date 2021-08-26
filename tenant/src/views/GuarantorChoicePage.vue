<template>
  <ProfileContainer :step="3">
    <div class="step fr-mb-3w">
      <div class="step-number">3</div>
      <div>
        <h4>{{ $t("title-step") }}</h4>
      </div>
    </div>
    <GuarantorChoice></GuarantorChoice>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuarantorChoice from "@/components/GuarantorChoice.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";

@Component({
  components: {
    GuarantorChoice,
    ProfileContainer
  }
})
export default class GuarantorChoicePage extends Vue {
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

<style lang="scss" scoped>
h4 {
  margin: 0;
}
.step-number {
  background-color: var(--primary);
  color: white;
  margin: 0.25rem 1rem 0 0;
  border-radius: 50%;
  display: inline-block;
  height: 25px;
  width: 25px;
  min-width: 25px;
  text-align: center;
  z-index: 1;
}
.step {
  display: flex;
  align-items: center;
}
</style>

<i18n>
{
"en": {
"title-step": "I fulfill my guarantor"
},
"fr": {
"title-step": "Mon garant"
}
}
</i18n>
