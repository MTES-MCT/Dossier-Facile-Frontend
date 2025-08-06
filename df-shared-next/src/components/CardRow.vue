<template>
  <NakedCard class="card-container">
    <div class="fr-grid-row">
      <div class="tags-container">
        <div class="v-center">
          <slot name="tag"></slot>
        </div>
        <div v-if="$slots.text" class="text-container" :class="{ danger: danger }">
          <slot name="text"></slot>
        </div>
      </div>
      <div class="btn-container">
        <button
          :title="t('edit')"
          class="fr-p-1w fr-mr-2w icon-btn"
          :class="{ danger: danger, 'color--primary': !danger }"
          @click="edit()"
        >
          <RiPencilLine />
        </button>
        <button
          ref="remove-btn"
          :title="t('remove')"
          class="fr-p-1w icon-btn"
          :class="{ danger: danger, 'color--primary': !danger }"
          @click="remove()"
        >
          <RiDeleteBin2Fill />
        </button>
      </div>
    </div>
    <div v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NakedCard from './NakedCard.vue'
import { RiDeleteBin2Fill, RiPencilLine } from '@remixicon/vue'
import { useTemplateRef } from 'vue'

const { t } = useI18n()

withDefaults(defineProps<{ danger?: boolean }>(), { danger: false })
const emit = defineEmits<{ edit: []; remove: [] }>()

const removeBtn = useTemplateRef('remove-btn')
defineExpose({ removeBtn })

function edit() {
  emit('edit')
}

function remove() {
  emit('remove')
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card-container {
  margin: 0.5rem 0rem;
  @media (min-width: 768px) {
    margin: 0.5rem 0;
    padding: 1.75rem 2rem;
  }
}

.tags-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.btn-container {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
}

.v-center {
  display: inline-flex;
  align-items: center;
}

.icon-btn {
  display: flex;
  border: 1px solid var(--primary);
  background-color: var(--background-default-grey);
  &.danger {
    border: 1px solid var(--danger);
  }
}

.text-container {
  display: inline-flex;
  align-items: center;
  @media (min-width: 768px) {
    flex-grow: 1;
    justify-content: center;
  }
}

.danger {
  color: var(--danger);
}
</style>

<i18n>
  {
    "en": {
      "edit": "Edit",
      "remove": "Remove"
    },
    "fr": {
      "edit": "Modifier",
      "remove": "Supprimer"
    }
  }
</i18n>
