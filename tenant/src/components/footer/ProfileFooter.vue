<template>
  <div>
    <FooterContainer id="footer-navigation">
      <BackNext
        :showBack="showBack"
        :nextLabel="nextLabel"
        :disabled="disabled"
        @on-next="nextAction()"
        @on-back="backAction()"
      ></BackNext>
    </FooterContainer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import FooterContainer from "./FooterContainer.vue";
import BackNext from "./BackNext.vue";

@Component({
  components: { VGouvFrButton, FooterContainer, BackNext },
})
export default class ProfileFooter extends Vue {
  @Prop({ default: true }) showBack!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop() nextLabel?: string;

  nextAction() {
    this.$emit("on-next");
  }

  backAction() {
    this.$emit("on-back");
  }
}
</script>

<style lang="scss"></style>
