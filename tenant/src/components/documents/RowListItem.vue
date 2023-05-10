<template>
  <li class="fr-grid-row file-list-item fr-p-3w">
    <div class="fr-col-12 fr-col-md-5">
      {{ label }}
    </div>
    <div class="fr-col-7 fr-col-md-4 fr-btns-group--right">
      <slot name="right"></slot>
      <DfButton
        class="fr-btn--icon-left fr-icon-pencil-line"
        v-if="$listeners && $listeners['click-edit']"
        @on-click="$emit('click-edit')"
      >
        <span class="fr-hidden fr-unhidden-lg">
          {{ $t("filerowlistitem.edit") }}
        </span>
      </DfButton>
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";

@Component({
  components: {
    DfButton,
    ColoredTag,
  },
})
export default class RowListItem extends Vue {
  @Prop() label!: string;
}
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
</style>
