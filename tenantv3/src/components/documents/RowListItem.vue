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
          <DfButton
            v-if="onClickEdit"
            @on-click="$emit('click-edit')"
          >
            <i class="ri-pencil-line fr-mr-1w" aria-hidden="true"></i>
            {{ $t("filerowlistitem.edit") }}
          </DfButton>
        </li>
      </ul>
    </div>
    <div class="desktop fr-col-12 fr-col-md-2 fr-btns-group--right">
      <DfButton
        v-if="onClickEdit"
        @on-click="$emit('click-edit')"
      >
        <i class="ri-pencil-line fr-mr-1w" aria-hidden="true"></i>
        {{ $t("filerowlistitem.edit") }}
      </DfButton>
    </div>
  </li>
</template>

<script setup lang="ts">
import DfButton from "df-shared-next/src/Button/Button.vue";

const props = 
  defineProps<{
    label: string,
    subLabel?: string,
    onClickEdit?: Function
  }>();

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
