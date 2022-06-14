<template>
  <transition name="fade">
    <div class="cookie" v-if="!props.hidden">
      <p>
        {{ t("cookies-text") }}
        <router-link to="/mentions-legales">{{ t("more") }}</router-link>
      </p>
      <DfButton
        :primary="true"
        :title="t('accept')"
        size="small"
        @on-click="accept"
      >
        {{ t("accept") }}
      </DfButton>
      <DfButton
        size="small"
        :title="t('deny')"
        @on-click="deny"
        class="fr-ml-3w"
      >
        {{ t("deny") }}
      </DfButton>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import DfButton from "../Button/Button.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    hidden?: boolean;
  }>(),
  {
    hidden: false
  }
);

const emit = defineEmits(["accept", "deny"]);

function accept() {
  emit("accept");
}
function deny() {
  emit("deny");
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
    "accept": "Accept",
    "deny": "Deny",
    "cookies-text": "By continuing your visit to this website, you agree to our use of cookies for statistics and to improve our service, in accordance with our policy of protecting your privacy.",
    "more": "Read more."
  },
  "fr": {
    "accept": "Accepter",
    "deny": "Refuser",
    "cookies-text": "DossierFacile utilise des cookies contribuant à la réalisation de statistiques et à l'amélioration de notre service, dans le respect de notre politique de protection de votre vie privée.",
    "more": "En savoir plus."
  }
}
</i18n>
