<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions()"
      :editedDocumentId="financialDocument.id ? financialDocument.id : -1"
      documentCategory="FINANCIAL"
      dispatchMethodName="saveTenantFinancial"
      typeDocument="typeDocumentFinancial"
      :showDownloader="showDownloader.value"
      :allowNoDocument="true"
      @enrich-form-data="enrichFormData"
      @on-change-document="changeDocument"
    >
      <template v-slot:after-select-block>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          v-if="
            documentType && documentType.key
              ? documentType.key !== 'no-income'
              : false
          "
        >
          <div>
            <validation-provider
              :rules="{ required: true, regex: /^[0-9 ]+$/ }"
              v-slot="{ errors, valid }"
            >
              <div
                class="fr-input-group"
                :class="{
                  'fr-input-group--error': errors[0]
                }"
              >
                <label for="monthlySum" class="fr-label"
                  >{{ $t("cotenantfinancialform.monthlySum-label") }} :</label
                >
                <input
                  id="monthlySum"
                  :placeholder="$t('cotenantfinancialform.monthlySum')"
                  type="number"
                  min="0"
                  step="1"
                  v-model="financialDocument.monthlySum"
                  name="monthlySum"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': valid,
                    'fr-input--error': errors[0]
                  }"
                  @input="updateMonthlySum"
                  required
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
                <span
                  class="fr-error-text"
                  v-if="
                    financialDocument
                      ? financialDocument.monthlySum
                        ? financialDocument.monthlySum > 10000
                        : false
                      : false
                  "
                >
                  {{ $t("cotenantfinancialform.high-salary") }}
                </span>
              </div>
            </validation-provider>
          </div>
        </NakedCard>

        <NakedCard
          v-else-if="documentType ? documentType.key === 'no-income' : false"
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
        >
          {{ $t("cotenantfinancialform.has-no-income") }}
          <ValidationObserver v-slot="{ validate, valid }">
            <form
              name="customTextForm"
              @submit.prevent="validate().then(goNext())"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="customTextNoDocument">
                  {{ $t("cotenantfinancialform.custom-text") }}
                </label>
                <textarea
                  v-model="document.customText"
                  maxlength="2000"
                  rows="3"
                  class="form-control fr-input validate-required"
                  :class="{
                    'fr-input--valid': valid
                  }"
                  id="customTextNoDocument"
                  name="customText"
                  placeholder=""
                  type="text"
                />
                <span
                  >{{
                    document && document.customText
                      ? document.customText.length
                      : 0
                  }}
                  / 2000</span
                >
              </div>
            </form>
          </ValidationObserver>
        </NakedCard>
      </template>
      <template v-slot:after-downloader> </template>
    </DocumentDownloader>
    <FooterContainer>
      <BackNext :showBack="true" @on-next="goNext" @on-back="goBack">
      </BackNext>
    </FooterContainer>
  </div>
</template>

<script lang="ts">
import { DfDocument } from "df-shared/src/models/DfDocument";
import { DocumentType } from "df-shared/src/models/Document";
import { Component, Prop, Vue } from "vue-property-decorator";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import DocumentDownloader from "./DocumentDownloader.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import FooterContainer from "../../footer/FooterContainer.vue";
import BackNext from "../../footer/BackNext.vue";
import { ref } from "@vue/reactivity";
import { isNumber } from "lodash";

@Component({
  components: {
    NakedCard,
    ValidationObserver,
    ValidationProvider,
    DocumentDownloader,
    FooterContainer,
    BackNext
  }
})
export default class CoTenantFinancialForm extends Vue {
  @Prop() coTenantId!: number;
  @Prop() financialDocument!: DfDocument;
  @Prop() allowNoIncome!: boolean;

  documentType?: DocumentType;
  document!: DfDocument;
  showDownloader = ref(false);

  documentsDefinitions() {
    return DocumentTypeConstants.FINANCIAL_DOCS.filter((d: DocumentType) => {
      return d.key !== "no-income" || this.allowNoIncome;
    });
  }

  changeDocument(docType?: DocumentType, doc?: DfDocument) {
    this.documentType = docType;
    this.document = doc as DfDocument;
    this.updateMonthlySum();
  }

  updateMonthlySum() {
    this.showDownloader.value = Boolean(
      this.documentType?.key &&
        this.documentType?.key != "no-income" &&
        !!this.financialDocument.monthlySum &&
        this.financialDocument.monthlySum >= 0
    );
  }

  enrichFormData(formData: FormData) {
    if (this.documentType?.key === "no-income") {
      this.document.noDocument = true;
      this.document.monthlySum = 0;
    }
    formData.append(
      "noDocument",
      this.document?.noDocument === true ? "true" : "false"
    );
    if (
      this.documentType?.key === "no-income" &&
      (!this.document.customText || this.document.customText.length < 0)
    ) {
      formData.append("customText", "-");
    } else {
      formData.append("customText", this.document.customText as string);
    }
    if (
      this.financialDocument.monthlySum !== undefined &&
      this.financialDocument.monthlySum >= 0
    ) {
      formData.append(
        "monthlySum",
        this.financialDocument.monthlySum.toString()
      );
    }
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    // push data if there is not files in documents - noDocument
    // TODO : we should have local value for monthlySum and customText and check for update
    // to know if we have to save or not
    if (
      this.document?.noDocument === true ||
      this.documentType?.key === "no-income" ||
      (this.financialDocument.monthlySum !== undefined &&
        this.financialDocument.monthlySum > 0) ||
      (this.document.customText !== undefined &&
        this.document.customText.length > 0)
    ) {
      const formData = new FormData();
      this.enrichFormData(formData);

      formData.append(
        "typeDocumentFinancial",
        this.documentType?.value as string
      );
      if (this.document.id && this.document.id > 0) {
        formData.append("id", this.document.id.toString());
      }
      formData.append("tenantId", this.coTenantId.toString());
      const loader = this.$loading.show();

      this.$store
        .dispatch("saveTenantFinancial", formData)
        .then(() => {
          Vue.toasted.global.save_success();
        })
        .catch(err => {
          if (err.response.data.message.includes("NumberOfPages")) {
            Vue.toasted.global.save_failed_num_pages();
          } else {
            Vue.toasted.global.save_failed();
          }
        })
        .finally(() => {
          loader.hide();
          this.$emit("on-next");
        });
    } else {
      this.$emit("on-next");
    }
  }
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

<i18n>
{
"en": {
  "title": "Financial's resources",
  "tenant": "Locataire",
  "owner": "Propriétaire",
  "guest": "Hébergé·e gratuitement",
  "guest-parents": "Chez mes parents",
  "files": "Documents",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to his/her situation again.",
  "salary": "Professional incomes",
  "social-service": "Social benefit payments",
  "rent": "Annuities",
  "pension": "Pensions",
  "scholarship": "Scholarship",
  "no-income": "No Income",
  "monthlySum": "Value in euros",
  "monthlySum-label": "Monthly salary (after tax)",
  "noDocument-social-service": "I cannot provide proof of payment of social benefits",
  "noDocument-salary": "I cannot provide the last three payslips or a balance sheet of my spouse",
  "noDocument-rent": "I cannot provide proof of rent",
  "noDocument-pension": "I cannot provide proof of pension",
  "noDocument-scholarship": "I cannot provide proof of scholarship",
  "customText-social-service": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-salary": "In order to improve my file, I explain why I cannot provide the last three payslips or a balance sheet of my spouse:",
  "customText-rent": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-pension": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-scholarship": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-undefined": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "custom-text": "To improve your file, you can explain why :",
  "high-salary": "You have entered a salary greater than € 10,000 are you sure you have entered your spouse monthly salary?",
  "low-salary": "You have entered a salary equal to 0 € are you sure you have entered your spouse monthly salary?",
  "has-no-income": "has not income",
  "number-not-valid": "Number not valid - without decimal",
  "delete-financial":  "Delete this salary",
  "field-required": "This field is required",
  "register": "Register",
  "warning-no-income-and-file": "You can't have files and no income. You must uncheck the box or delete your files.",
  "missing-file": "You must add files to save this income."
},
"fr": {
  "title": "Justificatif de ressources",
  "tenant": "Locataire",
  "owner": "Propriétaire",
  "guest": "Hébergé·e gratuitement",
  "guest-parents": "Chez ses parents",
  "files": "Documents",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à sa situation.",
  "salary": "Revenus professionnels",
  "social-service": "Prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "no-income": "Pas de revenus",
  "monthlySum": "Montant en euros",
  "monthlySum-label": "J'indique le montant de son revenu mensuel net à payer (avant prélèvement à la source)",
  "noDocument-social-service": "Je ne peux pas fournir de justificatifs de versement de prestations sociales",
  "noDocument-salary": "Je ne peux pas fournir ses trois derniers bulletins de salaire ",
  "noDocument-pension": "Je ne peux pas fournir de justificatifs de versement de pension",
  "noDocument-rent": "Je ne peux pas fournir de justificatifs de versement de rente",
  "noDocument-scholarship": "Je ne peux pas fournir de justificatifs d'attribution de bourse",
  "customText-social-service": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon conjoint :",
  "customText-salary": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les trois derniers bulletins de salaire ou un bilan comptable de mon conjoint :",
  "customText-pension": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon conjoint :",
  "customText-rent": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon conjoint :",
  "customText-scholarship": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon conjoint :",
  "customText-undefined": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs",
  "custom-text": "Afin d'améliorer votre dossier, vous pouvez ajouter une explication :",
  "high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi le salaire mensuel ?",
  "low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi le salaire mensuel ?",
  "has-no-income": "Vous avez indiqué l'absence de revenu",
  "number-not-valid": "Valeur incorrecte - entrez un chiffre sans virgule",
  "delete-financial":  "Supprimer ce revenu",
  "field-required": "Ce champ est requis",
  "register": "Enregistrer",
  "missing-file": "Vous devez ajouter des fichiers pour sauvegarder ce revenu.",
  "warning-no-income-and-file": "Vous ne pouvez pas avoir des fichiers et indiquer ne pas pouvoir fournir les fichiers. Veuillez décocher la case ou supprimer vos fichiers."
}
}
</i18n>
