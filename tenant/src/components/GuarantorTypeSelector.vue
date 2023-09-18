<template>
  <div>
    <RichRadioButtons
      name="guarantor-type-selector"
      v-model="checkedGuarantorType"
      @input="onButtonSelected"
      :elements="guarantorTypeOptions"
    ></RichRadioButtons>
    <ConfirmModal
      v-if="confirmGuarantorChangeModal"
      @valid="confirmGuarantorTypeChange()"
      @cancel="undoGuarantorTypeChange()"
    >
      <span>{{ $t("guarantorchoice.will-delete-guarantor") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RichRadioButtons from "df-shared/src/Button/RichRadioButtons.vue";
import { mapGetters, mapState } from "vuex";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";

@Component({
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      guarantor: "guarantor",
    }),
  },
  components: {
    ConfirmModal,
    RichRadioButtons,
  },
})
export default class GuarantorTypeSelector extends Vue {
  user!: User;
  guarantor!: Guarantor;

  @Prop({ default: false }) isCotenant!: boolean;
  @Prop() localStorageKey!: string;

  checkedGuarantorType = "";
  confirmGuarantorChangeModal = false;

  guarantorTypeOptions = [
    {
      id: "natural-person-choice",
      labelKey: "guarantorchoice.natural-person.label",
      description: "guarantorchoice.natural-person.description",
      iconClass: "fr-icon-user-line",
      optionName: "NATURAL_PERSON",
    },
    {
      id: "organism-choice",
      labelKey: "guarantorchoice.organism.label",
      description: "guarantorchoice.organism.description",
      iconClass: "fr-icon-award-line",
      optionName: "ORGANISM",
    },
    {
      id: "legal-person-choice",
      labelKey: "guarantorchoice.legal-person.label",
      description: "guarantorchoice.legal-person.description",
      iconClass: "fr-icon-bank-line",
      optionName: "LEGAL_PERSON",
    },
    {
      id: "no-guarantor-choice",
      labelKey: `${
        this.isCotenant ? "tenantguarantorchoice" : "guarantorchoice"
      }.no-guarantor`,
      iconClass: "fr-icon-close-line",
      optionName: "NO_GUARANTOR",
    },
  ];

  beforeMount() {
    if (this.guarantor.typeGuarantor && !this.isCotenant) {
      this.checkedGuarantorType = this.guarantor.typeGuarantor;
      this.selectType(this.guarantor.typeGuarantor);
    } else {
      this.resetType();
    }
  }

  onButtonSelected() {
    if (
      this.guarantor.typeGuarantor !== this.checkedGuarantorType &&
      (this.user.guarantors.length || 0) > 0 &&
      !this.isCotenant
    ) {
      this.confirmGuarantorChangeModal = true;
    } else {
      this.selectType(this.checkedGuarantorType);
    }
  }

  confirmGuarantorTypeChange() {
    this.$store.dispatch("deleteAllGuarantors").then(
      () => {
        this.confirmGuarantorChangeModal = false;
        this.selectType(this.checkedGuarantorType);
      },
      () => {
        Vue.toasted.global.error();
      }
    );
  }

  undoGuarantorTypeChange() {
    this.resetType();
    this.confirmGuarantorChangeModal = false;
  }

  selectType(type: string) {
    // TODO store on back-end side
    localStorage.setItem(this.localStorageKey, type);
    this.$emit("selected", this.checkedGuarantorType);
  }

  resetType() {
    const type = localStorage.getItem(this.localStorageKey);
    if (type) {
      this.checkedGuarantorType = type;
    }
    this.$emit("selected", this.checkedGuarantorType);
  }
}
</script>

<style scoped lang="scss">
@import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.css";
@import "@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.css";
</style>
