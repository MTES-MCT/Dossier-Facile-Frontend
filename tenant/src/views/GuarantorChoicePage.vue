<template>
  <ProfileContainer :step="3">
    <GuarantorChoice></GuarantorChoice>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuarantorChoice from "../components/GuarantorChoice.vue";
import ProfileContainer from "../components/ProfileContainer.vue";

@Component({
  components: {
    GuarantorChoice,
    ProfileContainer,
  },
})
export default class GuarantorChoicePage extends Vue {
  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
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
</style>
