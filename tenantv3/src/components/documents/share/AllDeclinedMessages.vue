<template>
  <PreValidationMessages :user-id="userId" :document="document"></PreValidationMessages>
  <div
    v-if="
      documentDeniedReasons !== null &&
      ((documentDeniedReasons.selectedOptions &&
        documentDeniedReasons.selectedOptions.length > 0) ||
        documentDeniedReasons.comment) &&
      documentStatus !== 'VALIDATED'
    "
    class="declined"
  >
    <div>
      <span class="fr-icon-message-2-fill fr-mr-1v" aria-hidden="true"></span>
      <span class="fr-text--bold">{{ t('declined-messages.header') }}</span>
    </div>
    <div>
      <ul v-if="messages.length > 1">
        <li v-for="(message, k) in messages" :key="k" v-html="message"></li>
      </ul>
      <div v-else v-html="messages[0]" class="fr-mt-1w"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DocumentDeniedReasons } from 'df-shared-next/src/models/DocumentDeniedReasons'
import PreValidationMessages from './PreValidationMessages.vue'
import { computed } from 'vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    documentDeniedReasons?: DocumentDeniedReasons | null
    documentStatus?: string
    userId?: number
    document?: DfDocument
  }>(),
  {
    documentDeniedReasons: null,
    documentStatus: '',
    userId: undefined,
    document: undefined
  }
)

const messages = computed(() => {
  let allMessages = [] as string[]
  const deniedReasons = props.documentDeniedReasons?.selectedOptions
  if (deniedReasons !== undefined) {
    allMessages = allMessages.concat(deniedReasons.map((r) => r.label))
  }
  const comment = props.documentDeniedReasons?.comment
  if (comment !== undefined) {
    allMessages.push(comment)
  }
  return allMessages
})
</script>

<style scoped lang="scss">
@import '@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.min.css';

.declined {
  padding: 1rem 1rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fce5e7;
  color: #525252;
  line-height: 2;
}
</style>
