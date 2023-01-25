<template>
  <div
    class="fr-col-12 fr-col-md-6 fr-col-xl-4 fr-pt-1w"
    @click.prevent="$emit('click')"
  >
    <div class="fr-tile fr-tile--horizontal">
      <div class="fr-tile__body fr-ml-2w fr-mr-2w">
        <h4 class="fr-tile__title">
          <a class="fr-tile__link" :title="$t('infocard.edit-title', [title])" href>{{
            title
          }}</a>
        </h4>
        <slot></slot>
        <button
          v-if="editable"
          class="fr-btn fr-btn--secondary edit-btn"
          :title="$t('infocard.edit')"
        >
          <span class="material-icons-outlined" aria-hidden="true">edit</span>
        </button>
      </div>
      <div class="fr-tile__img-wrap fr-ml-2w" aria-hidden="true">
        <span class="color--primary material-icons md-adapt">{{
          matIcon
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class InfoCard extends Vue {
  @Prop() public title!: string;
  @Prop() public matIcon!: string;
  @Prop() public editable!: boolean;
}
</script>

<style lang="scss" scoped>
.material-icons.md-adapt {
  font-size: 48px;
}

.fr-tile__body {
  overflow: auto;
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;
  box-shadow: none;
}
</style>
<i18n>
{
  "en": {
    "edit": "Edit",
    "edit-title": "Edit « {0} »"
  },
  "fr": {
    "edit": "Modifier",
    "edit-title": "Modifier « {0} »"
  }
}
</i18n>
