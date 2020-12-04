<template>
<div>
    <p>
        {{ $t("add-guarantor-question")}}
    </p>
    <button class="rf-btn" @click="addGuarantor()">{{ $t("add-guarantor-btn") }}</button>
    <div class="bg--blue info rf-p-2w rf-mt-2w rf-mb-2w border--radius">
        <h4 class="rf-mt-0">{{ $t("remark")}}</h4>
        <p>
            {{ $t("not-required")}}
        </p>
        <DfButton class="rf-btn" :label="$t('validate')" @on-click="goValidateFile"></DfButton>
    </div>
</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
    components: { DfButton }
})
export default class AskGuarantor extends Vue {
    addGuarantor() {
        this.$emit("on-next-step");
    }

    goValidateFile() {
        this.$store.commit("setStep", 4);
    }
}
</script>

<i18n>
{
    "en": {
        "add-guarantor-question": "Si vous le souhaitez nous vous proposons d'ajouter un garant.",
        "add-guarantor-btn": "Ajouter un garant",
        "remark": "Remarque",
        "not-required": "Ajouter un garant n'est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez cliquer dircetement sur le bouton ci-dessous «Valider mon dossier». Votre dossier sera alors enregistré pour être instruit.",
        "validate": "Valider mon dossier"
    },
    "fr": {
        "add-guarantor-question": "Si vous le souhaitez nous vous proposons d'ajouter un garant.",
        "add-guarantor-btn": "Ajouter un garant",
        "remark": "Remarque",
        "not-required": "Ajouter un garant n'est en aucun cas obligatoire. Si vous ne souhaitez pas ajouter de garant, vous pouvez cliquer dircetement sur le bouton ci-dessous «Valider mon dossier». Votre dossier sera alors enregistré pour être instruit.",
        "validate": "Valider mon dossier"
    }
}

</i18n>

<style lang="scss" scoped>
</style>