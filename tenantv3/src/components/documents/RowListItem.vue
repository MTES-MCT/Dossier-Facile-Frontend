<template>
  <li class="fr-grid-row file-list-item fr-p-3w">
    <p :id class="fr-col-12 fr-col-md-8 fr-mb-2w">
      {{ label }}
      <br />
      <span v-if="subLabel" class="fr-text--sm">
        {{ subLabel }}
      </span>
    </p>
    <RouterLink
      v-if="canEdit && to"
      :to
      class="fr-btn fr-btn--secondary large-btn fr-ml-auto"
      :aria-describedby="id"
    >
      <RiPencilLine class="fr-mr-1w" size="1rem" aria-hidden="true" />
      {{ t('filerowlistitem.edit') }}
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { RiPencilLine } from '@remixicon/vue'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  label: string
  subLabel?: string
  to?: RouteLocationRaw
  canEdit?: boolean
}>()

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
