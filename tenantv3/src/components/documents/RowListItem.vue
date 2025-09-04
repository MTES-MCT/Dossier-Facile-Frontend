<template>
  <li class="fr-grid-row file-list-item fr-p-3w">
    <p :id class="fr-col-12 fr-col-md-8 fr-mb-2w">
      {{ label }}
      <br />
      <span v-if="subLabel" class="fr-text--sm">
        {{ subLabel }}
      </span>
    </p>
    <DfButton
      v-if="canEdit"
      class="large-btn fr-ml-auto"
      :aria-describedby="id"
      @click="$emit('click-edit')"
    >
      <RiPencilLine class="fr-mr-1w" size="1rem" aria-hidden="true" />
      {{ t('filerowlistitem.edit') }}
    </DfButton>
  </li>
</template>

<script setup lang="ts">
import { RiPencilLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

defineEmits<{ 'click-edit': [] }>()

withDefaults(
  defineProps<{
    label: string
    subLabel?: string
    canEdit?: boolean
  }>(),
  {
    canEdit: false,
    subLabel: undefined
  }
)

const { t } = useI18n()
const id = useId()
</script>

<style lang="scss">
.file-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-style: solid;
  border-width: thin;
  border-radius: 0.25rem;
  border-color: var(--grey-900-175);
  min-height: 4rem;
}

.large-btn {
  justify-content: center;
  flex-grow: 1;
  @media (min-width: 768px) {
    flex-grow: 0;
  }
}
</style>
