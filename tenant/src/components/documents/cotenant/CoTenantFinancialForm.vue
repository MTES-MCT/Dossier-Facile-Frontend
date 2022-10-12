<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      :editedDocumentId="financialDocument? financialDocument.id : null"
      documentCategory="FINANCIAL"
      dispacthMethodName="saveTenantFinancial"
      typeDocument="typeDocumentFinancial"
      :allowNoDocument="true"
      @enrich-form-data="enrichFormData"
      @on-change-document="changeDocument"
    >
      <!-- @enrich-form-data="enrichFormData" -->
      <!-- @check-before-add-file="checkValid"-->
      <!--    
        //:documents="documents"
      //@on-remove-file=""
      //@on-add-file=""
      //@on-change-document=""
      //@on-valid-change-document=""
      documentExplainationText=""
      //documentDeniedReasons="documentDeniedReasons"
      //documentStatus="documentStatus"
    -->
      <template v-slot:after-select-block>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w"
          v-if="documentType ? documentType.key !== 'no-income' : false"
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
                  >{{ $t("monthlySum-label") }} :</label
                >
                <input
                  id="monthlySum"
                  :placeholder="$t('monthlySum')"
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
                  {{ $t("high-salary") }}
                </span>
              </div>
            </validation-provider>
          </div>
        </NakedCard>
        <!--       <div>
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
                >{{ $t("monthlySum-label") }} :</label
              >
              <input
                id="monthlySum"
                :placeholder="$t('monthlySum')"
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
                required
              />
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
              <span
                class="fr-error-text"
                v-if="financialDocument.monthlySum > 10000"
              >
                {{ $t("high-salary") }}
              </span>
              <span
                class="fr-error-text"
                v-if="
                  financialDocument.monthlySum !== '' &&
                    financialDocument.monthlySum <= 0
                "
              >
                {{ $t("low-salary") }}
              </span>
            </div>
          </validation-provider>
        </div>
        <MonFranceConnect
          v-if="
            ['social-service', 'pension', 'rent'].includes(
              financialDocument.documentType.key
            )
          "
          class="fr-my-4w"
        ></MonFranceConnect>
        <div class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group">
          <input
            type="checkbox"
            id="noDocument"
            value="false"
            v-model="financialDocument.noDocument"
          />
          <label for="noDocument">
            {{ $t(getCheckboxLabel(financialDocument.documentType.key)) }}
          </label>
        </div>

        <div class="fr-mb-5w" v-if="financialDocument.noDocument">
          <validation-provider
            :rules="{ required: true }"
            v-slot="{ errors, valid }"
          >
            <div class="fr-input-group">
              <label class="fr-label" for="customText">
                {{ $t(`customText-${financialDocument.documentType.key}`) }}
              </label>
              <textarea
                v-model="financialDocument.customText"
                class="form-control fr-input validate-required"
                :class="{
                  'fr-input--valid': valid,
                  'fr-input--error': errors[0]
                }"
                id="customText"
                name="customText"
                placeholder=""
                type="text"
                maxlength="2000"
                rows="3"
                required
              />
              <span>{{ financialDocument.customText.length }} / 2000</span>
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>

        <NakedCard class="fr-p-md-5w fr-mb-3w">
          {{ $t("has-no-income") }}
          <ValidationObserver v-slot="{ validate, valid }">
            <form
              name="customTextForm"
              @submit.prevent="validate().then(save())"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="customTextNoDocument">
                  {{ $t("custom-text") }}
                </label>
                <textarea
                  v-model="financialDocument.customText"
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
                <span>{{ financialDocument.customText.length }} / 2000</span>
              </div>
            </form>
          </ValidationObserver>
        </NakedCard>-->
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
import { ValidationProvider } from "vee-validate";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import FooterContainer from '../../footer/FooterContainer.vue';
import BackNext from "../../footer/BackNext.vue";
import Financial from "../tenant/Financial.vue";

@Component({
  components: {
    NakedCard,
    ValidationProvider,
    DocumentDownloader,
    FooterContainer,
    BackNext
  },
  computed: {}
})
export default class CoTenantFinancialForm extends Vue {
  @Prop() coTenantId!: number;
  @Prop() financialDocument!: DfDocument;

  documentsDefinitions = DocumentTypeConstants.FINANCIAL_DOCS;
  documentType?: DocumentType;
  document!: DfDocument;
  isNoIncomeAndFiles = false;

  mounted() {
    console.log("mount fina=" + this.financialDocument.id);
    
  }

  changeDocument(docType?: DocumentType, doc?: DfDocument) {
    console.log("change doc");
    console.log(doc);
    this.documentType = docType;
    this.document = doc as DfDocument;
  }

  enrichFormData(formData: FormData) {
    console.log("docType");
    console.log(this.documentType);
    if (this.documentType?.key === "no-income") {
      console.log("NO INCOME");
      this.document.noDocument = true;
      this.document.monthlySum = 0;
    }
    console.log(this.document);

    formData.append(
      "noDocument",
      (this.document?.noDocument === true )? "true" : "false"
    );
    if (
      this.documentType?.key === "no-income" && ( !this.document.customText || this.document.customText.length < 0)
    ) {
      formData.append("customText", "-");
    } else {
      formData.append("customText", this.document.customText as string);
    }
    console.log("this.financialDocument.monthlySum");
    console.log(this.financialDocument.monthlySum);
    if (
      this.financialDocument.monthlySum !== undefined &&
      this.financialDocument.monthlySum >= 0
    ) {
      formData.append(
        "monthlySum",
        this.financialDocument.monthlySum.toString()
      );
    }

    if (this.financialDocument.id) {
      formData.append("id", this.financialDocument.id.toString());
    }
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    console.log("goNext");
    // push data if there is not files in documents - noDocument
    if (this.document?.noDocument === true) {
      console.log("goNext");
      const formData = new FormData();
      this.enrichFormData(formData);

      formData.append(
        "typeDocumentFinancial",
        this.documentType?.value as string
      );
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
  "description": "",
  "tenant": "Locataire",
  "owner": "Propriétaire",
  "guest": "Hébergé·e gratuitement",
  "guest-parents": "Chez mes parents",
  "files": "Documents",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to his/her situation again.",
  "select-label": "Your Spouse current accommodation situation:",
  "salary": "Salary",
  "guarantor_salary": "Salary or other professional income",
  "social-service": "Social benefit payments",
  "rent": "Annuities",
  "pension": "Pensions",
  "scholarship": "Scholarship",
  "monthlySum": "Value in euros",
  "monthlySum-label": "Monthly salary (after tax)",
  "noDocument-social": "I cannot provide proof of payment of social benefits",
  "noDocument-salary": "I cannot provide the last three payslips or a balance sheet of my guarantor",
  "noDocument-rent": "I cannot provide proof of rent",
  "noDocument-pension": "I cannot provide proof of pension",
  "noDocument-scholarship": "I cannot provide proof of scholarship",
  "customText-social-service": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-salary": "In order to improve my file, I explain why I cannot provide the last three payslips or a balance sheet of my guarantor:",
  "customText-rent": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-pension": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-scholarship": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "customText-undefined": "In order to improve my file, I explain why I cannot provide the justificatives:",
  "high-salary": "You have entered a salary greater than € 10,000 are you sure you have entered your guarantor monthly salary?",
  "low-salary": "You have entered a salary equal to 0 € are you sure you have entered your guarantor monthly salary?",
  "number-not-valid": "Number not valid - without decimal",
  "delete-financial":  "Delete this salary",
  "field-required": "This field is required",
  "will-delete-files": "Please note, a change of situation will result in the deletion of your supporting documents. You will have to upload the supporting documents corresponding to your situation again.",
  "register": "Register",
  "warning-no-income-and-file": "You can't have files and no income. You must uncheck the box or delete your files.",
  "missing-file": "You must add files to save this income.",
  "select-label": "Attention, Please enter only your guarantor own income."
},
"fr": {
  "title": "Justificatif de ressources",
  "description": "",
  "tenant": "Locataire",
  "owner": "Propriétaire",
  "guest": "Hébergé·e gratuitement",
  "guest-parents": "Chez ses parents",
  "files": "Documents",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression de vos justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à sa situation.",
  "select-label": "La situation d’hébergement actuelle de votre conjoint:",
  "salary": "Salaire",
  "guarantor_salary": "Salaires",
  "social-service": "Prestations sociales",
  "rent": "Rentes",
  "pension": "Pensions",
  "scholarship": "Bourses",
  "monthlySum": "Montant en euros",
  "monthlySum-label": "J'indique le montant de son revenu mensuel net à payer (avant prélèvement à la source)",
  "noDocument-social": "Je ne peux pas fournir de justificatifs de versement de prestations sociales",
  "noDocument-salary": "Je ne peux pas fournir les trois derniers bulletins de salaire ou un bilan comptable de mon garant",
  "noDocument-pension": "Je ne peux pas fournir de justificatifs de versement de pension",
  "noDocument-rent": "Je ne peux pas fournir de justificatifs de versement de rente",
  "noDocument-scholarship": "Je ne peux pas fournir de justificatifs d'attribution de bourse",
  "customText-social-service": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-salary": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les trois derniers bulletins de salaire ou un bilan comptable de mon garant :",
  "customText-pension": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-rent": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-scholarship": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs de mon garant :",
  "customText-undefined": "Afin d'améliorer mon dossier, j'explique pourquoi je ne peux pas fournir les justificatifs",
  "high-salary": "Vous avez saisi un salaire supérieur à 10 000€ êtes-vous sûr d'avoir saisi le salaire mensuel ?",
  "low-salary": "Vous avez saisi un salaire égal à 0€ êtes-vous sûr d'avoir saisi le salaire mensuel ?",
  "number-not-valid": "Valeur incorrecte - entrez un chiffre sans virgule",
  "delete-financial":  "Supprimer ce revenu",
  "field-required": "Ce champ est requis",
  "will-delete-files": "Attention, un changement de situation entraînera la suppression des justificatifs. Vous devrez charger de nouveau les justificatifs correspondant à la situation de votre garant.",
  "register": "Enregistrer",
  "select-label": "Attention, veuillez renseigner uniquement les revenus de votre garant.",
  "missing-file": "Vous devez ajouter des fichiers pour sauvegarder ce revenu.",
  "warning-no-income-and-file": "Vous ne pouvez pas avoir des fichiers et indiquer ne pas pouvoir fournir tous les fichiers. Veuillez décocher la case ou supprimer vos fichiers."

}
}
</i18n>
