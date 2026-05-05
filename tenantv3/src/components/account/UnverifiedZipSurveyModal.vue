<script lang="ts">
export const ZIP_SURVEY_ANSWERED_STORAGE_KEY = 'df-zip-survey-answered'
</script>

<script setup lang="ts">
import { createWidget } from '@typeform/embed'
import '@typeform/embed/build/css/widget.css'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const TYPEFORM_FORM_ID =
  import.meta.env.VITE_ZIP_SURVEY_TYPEFORM_ID ?? 'JQFIjNOI'

const { t } = useI18n()

const isOpened = defineModel<boolean>('isOpened', { default: false })

const embedContainerRef = ref<HTMLElement | null>(null)

let widgetApi: ReturnType<typeof createWidget> | null = null

function unmountWidget() {
  widgetApi?.unmount()
  widgetApi = null
  if (embedContainerRef.value) {
    embedContainerRef.value.innerHTML = ''
  }
}

function mountWidget() {
  const el = embedContainerRef.value
  if (!el) {
    return
  }

  unmountWidget()

  widgetApi = createWidget(TYPEFORM_FORM_ID, {
    container: el,
    hideHeaders: true,
    hideFooter: true,
    autoResize: true,
    onSubmit: () => {
      localStorage.setItem(ZIP_SURVEY_ANSWERED_STORAGE_KEY, 'true')
    },
    onEndingButtonClick: () => {
      isOpened.value = false
    },
    onClose: () => {
      isOpened.value = false
    }
  })
}

watch(isOpened, async (open) => {
  if (open) {
    await nextTick()
    mountWidget()
  } else {
    unmountWidget()
  }
})

onBeforeUnmount(() => {
  unmountWidget()
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
