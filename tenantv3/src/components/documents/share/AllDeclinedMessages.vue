<template>
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
      <span class="fr-text--bold">{{ $t('declined-messages.header') }}</span>
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
import { onBeforeMount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    documentDeniedReasons?: DocumentDeniedReasons | null
    documentStatus?: string
  }>(),
  {
    documentDeniedReasons: null,
    documentStatus: ''
  }
)

const messages = ref<string[]>([])

onBeforeMount(() => {
  const deniedReasons = props.documentDeniedReasons?.selectedOptions
  if (deniedReasons !== undefined) {
    messages.value = messages.value.concat(deniedReasons.map((r) => r.label))
  }
  const comment = props.documentDeniedReasons?.comment
  if (comment !== undefined) {
    messages.value.push(comment)
  }
  return messages
})
</script>

<style scoped lang="scss">
@import '@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.css';

.declined {
  padding: 1rem 1rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fce5e7;
  color: #525252;
  line-height: 2;
}
</style>
