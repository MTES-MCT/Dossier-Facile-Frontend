<template>
  <div>
    <RichRadioButtons
      name="application-type-selector"
      v-model="checkedApplicationType"
      @input="onChange"
      :elements="applicationTypeOptions"
    ></RichRadioButtons>
    <ConfirmModal
      v-if="showConfirmationModal"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ getConfirmModalContent() }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RichRadioButtons from "df-shared/src/Button/RichRadioButtons.vue";
import { mapGetters, mapState } from "vuex";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { User } from "df-shared/src/models/User";

@Component({
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      roommates: "getRoommates",
    }),
  },
  components: {
    ConfirmModal,
    RichRadioButtons,
  },
})
export default class ApplicationTypeSelector extends Vue {
  user!: User;
  roommates!: User[];

  applicationType = "";
  checkedApplicationType = "";

  showConfirmationModal = false;

  applicationTypeOptions = [
    {
      id: "alone-choice",
      labelKey: "tenantinformationform.alone",
      iconClass: "fr-icon-user-line",
      optionName: "ALONE",
    },
    {
      id: "couple-choice",
      labelKey: "tenantinformationform.couple",
      iconClass: "fr-icon-user-line",
      iconCount: 2,
      optionName: "COUPLE",
    },
    {
      id: "group-choice",
      labelKey: "tenantinformationform.roommate",
      iconClass: "fr-icon-team-line",
      optionName: "GROUP",
    },
  ];

  beforeMount() {
    this.applicationType = this.user.applicationType || "ALONE";
    this.checkedApplicationType = this.applicationType;
  }

  onChange() {
    if (this.applicationType === this.checkedApplicationType) {
      return;
    }
    if (this.roommates.length || 0 > 1) {
      this.displayConfirmationModal();
    } else {
      this.applicationType = this.checkedApplicationType;
      this.$emit("selected", this.checkedApplicationType);
    }
  }

  undoSelect() {
    this.checkedApplicationType = this.applicationType;
    this.hideConfirmationModal();
  }

  validSelect() {
    this.applicationType = this.checkedApplicationType;
    this.hideConfirmationModal();
    this.$emit("selected", this.checkedApplicationType);
  }

  getConfirmModalContent(): string {
    return this.applicationType === "COUPLE"
      ? this.$tc("tenantinformationform.will-delete-couple")
      : this.$tc("tenantinformationform.will-delete-roommates");
  }

  displayConfirmationModal() {
    this.showConfirmationModal = true;
  }

  hideConfirmationModal() {
    this.showConfirmationModal = false;
  }
}
</script>

<style scoped lang="scss">
@import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.css";
</style>
