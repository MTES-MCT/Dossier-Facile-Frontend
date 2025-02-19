<template>
  <li class="fr-grid-row file-list-item fr-p-3w">
    <div class="fr-col-12 fr-col-md-10 fr-mb-2w">
      {{ props.label }}
      <br />
      <span v-if="props.subLabel" class="fr-text--sm">
        {{ props.subLabel }}
      </span>
    </div>
    <div class="mobile fr-col-12 fr-col-md-2">
      <ul class="fr-btns-group">
        <li>
          <DfButton v-if="canEdit" @click="$emit('click-edit')">
            <RiPencilLine class="fr-mr-1w" size="1rem" aria-hidden="true" />
            {{ t('filerowlistitem.edit') }}
          </DfButton>
        </li>
      </ul>
    </div>
    <div class="desktop fr-col-12 fr-col-md-2 fr-btns-group--right">
      <DfButton v-if="canEdit" @click="$emit('click-edit')">
        <RiPencilLine class="fr-mr-1w" size="1rem" aria-hidden="true" />
        {{ t('filerowlistitem.edit') }}
      </DfButton>
    </div>
  </li>
</template>

<script setup lang="ts">
import { RiPencilLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useI18n } from 'vue-i18n'

defineEmits<{ 'click-edit': [] }>()

const props = withDefaults(
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

.mobile {
  @media all and (max-width: 768px) {
    display: block !important;
  }
}
</style>
