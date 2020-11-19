<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        Votre situation d'hébergement actuelle :
      </label>
      <select
        v-model="user.residency"
        class="rf-select"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option value="TENANT">{{ $t("tenant") }}</option>
        <option value="OWNER">{{ $t("owner") }}</option>
        <option value="GUEST">{{ $t("guest") }}</option>
        <option value="GUEST_PARENTS">{{ $t("guest-parents") }}</option>
      </select>
    </div>
    <div>
      J'ajoute un avis de taxes foncières de moins d'un an.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Residency extends Vue {}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"tenant": "Locataire",
"owner": "Propriétaire",
"guest": "Invité",
"guest-parents": "Chez vos parents"
},
"fr": {
"tenant": "Locataire",
"owner": "Propriétaire",
"guest": "Invité",
"guest-parents": "Chez vos parents"
}
}
</i18n>
