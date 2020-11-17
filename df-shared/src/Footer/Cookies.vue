<template>
  <transition name="fade">
    <div class="cookie" v-if="!hidden">
      <p>
        En poursuivant votre navigation sur notre site, vous acceptez
        l'utilisation des cookies contribuant à la réalisation de statistiques
        et à l'amélioration de notre service, dans le respect de notre politique
        de protection de votre vie privée.
      </p>
      <button class="rf-btn" @click="hideCookie">
        {{ $t("understood") }}
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Cookies extends Vue {
  @Prop({ default: false }) hidden!: boolean;

  hideCookie() {
    this.$emit("hide-cookie");
  }
}
</script>

<style lang="scss" scoped>
.cookie {
  position: fixed;
  z-index: 9999;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  background: rgba(250, 250, 250, 0.95);
  border: 1px solid #ececec;
  border-radius: 6px;
  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.04);
  padding: 1.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<i18n>
{
  "en": {
    "understood": "J'ai compris"
  },
  "fr": {
    "understood": "J'ai compris"
  }
}
</i18n>
