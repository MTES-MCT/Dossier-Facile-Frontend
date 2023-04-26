<template>
  <fieldset class="fr-fieldset" id="radio-rich">
    <RichRadioButton
      :label="$t('tenantinformationform.alone')"
      icon="fr-icon-user-line"
      name="application-type"
      id="alone-choice"
      :checked="applicationType == 'ALONE'"
      @checked="onChecked('ALONE')"
    ></RichRadioButton>
    <RichRadioButton
      :label="$t('tenantinformationform.couple')"
      icon="fr-icon-group-line"
      name="application-type"
      id="couple-choice"
      :checked="applicationType == 'COUPLE'"
      @checked="onChecked('COUPLE')"
    ></RichRadioButton>
    <RichRadioButton
      :label="$t('tenantinformationform.roommate')"
      icon="fr-icon-team-line"
      name="application-type"
      id="group-choice"
      :checked="applicationType == 'GROUP'"
      @checked="onChecked('GROUP')"
    ></RichRadioButton>
  </fieldset>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import RichRadioButton from "df-shared/src/Button/RichRadioButton.vue";

@Component({
  components: { RichRadioButton },
})
export default class ApplicationTypeSelector extends Vue {
  @Prop() applicationType!: string;

  onChecked(applicationType: string) {
    this.$emit("selected", applicationType);
  }
}
</script>

<style scoped lang="scss">
@import "@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.css";
</style>
