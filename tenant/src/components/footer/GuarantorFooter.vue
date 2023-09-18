<template>
  <div>
    <FooterContainer>
      <BackNext
        :showBack="showBack"
        @on-next="nextAction()"
        @on-back="backAction()"
      >
      </BackNext>
    </FooterContainer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import FooterContainer from "./FooterContainer.vue";
import { mapGetters } from "vuex";
import { Guarantor } from "df-shared/src/models/Guarantor";
import BackNext from "./BackNext.vue";

@Component({
  components: { VGouvFrButton, FooterContainer, BackNext },
  computed: {
    ...mapGetters({
      guarantors: "guarantors",
    }),
  },
})
export default class ProfileFooter extends Vue {
  @Prop({ default: true }) showBack!: boolean;

  guarantors!: Guarantor[];

  nextAction() {
    this.$emit("on-next");
  }

  backAction() {
    this.$emit("on-back");
  }
}
</script>
