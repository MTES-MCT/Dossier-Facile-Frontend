<template>
  <li
    class="fr-grid-row file-item"
    :class="{ 'not-validated': documentStatus() != 'VALIDATED' }"
  >
    <div class="fr-col-12 fr-col-md-4">
      <span :class="listItemIconClass()">
        {{ label }}
      </span>
    </div>
    <div class="fr-col-8 fr-col-md-6 tag-container">
      <div style="align-self: center">
        <ColoredTag :text="getTagLabel()" :status="documentStatus()"></ColoredTag>
      </div>
      <div>
        <slot name="postTag"></slot>
      </div>
    </div>
    <div class="fr-col-4 fr-col-md-2 fr-btns-group--right">
      <DfButton
        v-if="enableDownload && documentStatus() == 'VALIDATED'"
        class="fr-btn--icon-left fr-fi-eye-line"
        @on-click="openDocument()"
      >
        {{ $t("see") }}</DfButton
      >
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";
import { DfDocument } from "df-shared/src/models/DfDocument";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";

@Component({
  components: {
    DfButton,
    ColoredTag
  }
})
export default class FileRowListItem extends Vue {
  @Prop() label!: string;
  @Prop() document!: DfDocument;
  @Prop({ default: true }) enableDownload?: boolean;
  @Prop() tagLabel?: boolean;

  getTagLabel() {
    if (this.tagLabel) {
      return this.tagLabel;
    }
    return this.$i18n.t(this.documentStatus());
  }

  documentStatus() {
    if (this.document) {
      return this.document?.documentStatus
        ? this.document?.documentStatus
        : "EMPTY";
    }
    return "EMPTY";
  }

  openDocument() {
    window.open(this.document.name, "_blank");
  }

  listItemIconClass() {
    switch (this.document?.documentStatus) {
      case "TO_PROCESS":
        return "fr-icon-information-fill";
      case "VALIDATED":
        return "fr-icon-checkbox-circle-line";
      case "DECLINED":
        return "fr-icon-alert-fill";
    }
    return "fr-icon-circle-empty";
  }
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
  margin-right: 0.5rem;
  background-color: transparent;
  color: grey;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  height: 20px;
  width: 20px;
  margin: 4px 8px 4px 6px;
}
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-style: solid;
  border-width: thin;
  border-radius: 0.25rem;
  border-color: var(--green-menthe-975-75);
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

<i18n>

{
  "en": {
    "see": "See",
    "TO_PROCESS": "To process",
    "VALIDATED": "Validated",
    "DECLINED": "Declined",
    "INCOMPLETE": "Incomplete",
    "EMPTY": "Missing Document"
  },
  "fr": {
    "see": "Voir",
    "TO_PROCESS": "En cours de traitement",
    "VALIDATED": "Vérifié",
    "DECLINED": "Modification demandée",
    "INCOMPLETE": "Non terminé",
    "EMPTY": "Document manquant"
  }
}
</i18n>
