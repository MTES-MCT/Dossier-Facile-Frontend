<template>
  <div>
    <fieldset class="fr-fieldset" id="radio-rich">
      <RichRadioButton
        :label="$tc('tenantinformationform.alone')"
        icon="fr-icon-user-line"
        name="application-type"
        id="alone-choice"
        optionValue="ALONE"
        v-model="checkedApplicationType"
        @input="onChange"
      ></RichRadioButton>
      <RichRadioButton
        :label="$tc('tenantinformationform.couple')"
        icon="fr-icon-group-line"
        name="application-type"
        id="couple-choice"
        optionValue="COUPLE"
        v-model="checkedApplicationType"
        @input="onChange"
      ></RichRadioButton>
      <RichRadioButton
        :label="$tc('tenantinformationform.roommate')"
        icon="fr-icon-team-line"
        name="application-type"
        id="group-choice"
        optionValue="GROUP"
        v-model="checkedApplicationType"
        @input="onChange"
      ></RichRadioButton>
    </fieldset>
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
import RichRadioButton from "df-shared/src/Button/RichRadioButton.vue";
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
  components: { ConfirmModal, RichRadioButton },
})
export default class ApplicationTypeSelector extends Vue {
  user!: User;
  roommates!: User[];

  applicationType = "";
  checkedApplicationType = "";

  showConfirmationModal = false;

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
