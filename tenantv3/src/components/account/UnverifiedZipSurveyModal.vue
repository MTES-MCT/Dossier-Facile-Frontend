<script setup lang="ts">
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const TYPEFORM_FORM_ID =
  import.meta.env.VITE_ZIP_SURVEY_TYPEFORM_ID ?? '01KN6MS5FGWMVJGNKT01SH8R5A'

const TYPEFORM_EMBED_SRC = 'https://embed.typeform.com/next/embed.js'

const { t } = useI18n()

const isOpened = defineModel<boolean>('isOpened', { default: false })

const embedContainerRef = ref<HTMLElement | null>(null)
let scriptElement: HTMLScriptElement | null = null

function clearContainer() {
  if (embedContainerRef.value) {
    embedContainerRef.value.innerHTML = ''
  }
}

function removeScript() {
  scriptElement?.remove()
  scriptElement = null
}

function loadEmbed() {
  if (!embedContainerRef.value) {
    return
  }
  clearContainer()
  removeScript()

  const target = document.createElement('div')
  target.setAttribute('data-tf-live', TYPEFORM_FORM_ID)
  embedContainerRef.value.appendChild(target)

  scriptElement = document.createElement('script')
  scriptElement.src = TYPEFORM_EMBED_SRC
  scriptElement.async = true
  document.body.appendChild(scriptElement)
}

watch(isOpened, async (open) => {
  if (open) {
    await nextTick()
    loadEmbed()
  } else {
    clearContainer()
    removeScript()
  }
})

onBeforeUnmount(() => {
  clearContainer()
  removeScript()
})
</script>

<template>
  <DsfrModalPatch
    v-model:is-opened="isOpened"
    modal-id="modal-unverified-zip-survey"
    :title="t('zip-survey.title')"
    size="lg"
  >
    <p class="fr-text--sm fr-mb-2w">{{ t('zip-survey.subtitle') }}</p>
    <div ref="embedContainerRef" class="zip-survey-embed" />
  </DsfrModalPatch>
</template>

<style scoped lang="scss">
.zip-survey-embed {
  min-height: min(560px, 70vh);
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "zip-survey": {
      "title": "Answer a few questions about your file",
      "subtitle": "The file you downloaded has not yet been verified by our team and may contain errors."
    }
  },
  "fr": {
    "zip-survey": {
      "title": "Répondez à quelques questions sur votre dossier",
      "subtitle": "Le dossier que vous venez de télécharger n'est pas encore vérifié par notre équipe et peut contenir des erreurs."
    }
  }
}
</i18n>
