<template>
  <li
    class="fr-grid-row file-list-item fr-p-3w"
    :class="{ 'not-validated': documentStatus() != 'VALIDATED' }"
  >
    <p :id class="fr-col-7 fr-col-md-5 fr-mb-2w">
      {{ label }}
      <br />
      <span v-if="subLabel" class="fr-text--xs">
        {{ subLabel }}
      </span>
    </p>
    <div class="fr-col-5 fr-col-md-3 tag-container fr-mb-2w">
      <div style="align-self: center">
        <ColoredTag :text="getTagLabel()" :status="documentStatus()"></ColoredTag>
      </div>
      <div>
        <slot name="postTag"></slot>
      </div>
    </div>
    <div v-if="enableDownload || canEdit" class="fr-col-12 fr-col-md-4 fr-btns-group--right">
      <a
        v-if="
          enableDownload &&
          document &&
          document.name &&
          (!showValidated || document.documentStatus === 'VALIDATED')
        "
        :href="document.name"
        :title="t('filerowlistitem.see-title')"
        target="_blank"
        :aria-describedby="id"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-fi-eye-line fr-mr-1w"
      >
        {{ t('filerowlistitem.see') }}
      </a>

      <RouterLink
        v-if="canEdit && to"
        :to
        type="button"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-pencil-line"
        :aria-describedby="id"
        @click="$emit('click-edit')"
      >
        {{ t('filerowlistitem.edit') }}
      </RouterLink>
    </div>
  </li>
</template>

<script setup lang="ts">
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import { useI18n } from 'vue-i18n'
import { useId } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

defineEmits<{ 'click-edit': [] }>()

const props = withDefaults(
  defineProps<{
    label: string
    subLabel?: string
    document?: DfDocument
    enableDownload?: boolean
    tagLabel?: string
    showValidated?: boolean
    canEdit?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    subLabel: undefined,
    document: undefined,
    enableDownload: true,
    tagLabel: undefined,
    showValidated: false,
    canEdit: false,
    to: undefined
  }
)

const { t } = useI18n()
const id = useId()

function getTagLabel() {
  if (props.tagLabel) {
    return props.tagLabel
  }
  return t('documents.status.' + documentStatus()).toString()
}

function documentStatus() {
  if (props.document) {
    return props.document.documentStatus ? props.document.documentStatus : 'EMPTY'
  }
  return 'EMPTY'
}
</script>

<style lang="scss">
.fr-icon-checkbox-circle-line:before {
  margin-right: 0.5rem;
  color: green;
}

.fr-icon-information-fill:before {
  margin-right: 0.5rem;
  color: var(--purple-text);
}

.fr-icon-alert-fill:before {
  margin-right: 0.5rem;
  color: var(--danger);
}

.fr-icon-circle-empty:before {
  background-color: transparent;
  color: grey;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  height: 20px;
  width: 20px;
  margin: 4px 8px 4px 6px;
}

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

  &.not-validated {
    background-color: var(--background-alt-grey);
    border-style: none;
  }
}

.tag-container {
  display: flex;
  @media all and (max-width: 767px) {
    flex-direction: column;
  }
}
</style>
