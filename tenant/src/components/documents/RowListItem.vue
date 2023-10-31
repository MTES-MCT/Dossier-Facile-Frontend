<template>
  <li class="fr-grid-row file-list-item fr-p-3w">
    <div class="fr-col-12 fr-col-md-10 fr-mb-2w">
      {{ label }}
      <br />
      <span v-if="subLabel" class="fr-text--sm">
        {{ subLabel }}
      </span>
    </div>
    <div class="mobile fr-col-12 fr-col-md-2">
      <ul class="fr-btns-group">
        <li>
          <DfButton
            v-if="$listeners && $listeners['click-edit']"
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
        v-if="$listeners && $listeners['click-edit']"
        @on-click="$emit('click-edit')"
      >
        <i class="ri-pencil-line fr-mr-1w" aria-hidden="true"></i>
        {{ $t("filerowlistitem.edit") }}
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
  @Prop() subLabel!: string;
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

.mobile {
  @media all and (max-width: 768px) {
    display: block !important;
  }
}
</style>
