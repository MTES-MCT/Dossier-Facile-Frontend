<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions()"
      :editedDocumentId="financialDocument.id ? financialDocument.id : -1"
      documentCategory="FINANCIAL"
      dispatchMethodName="saveTenantFinancial"
      typeDocument="typeDocumentFinancial"
      :showDownloader="showDownloader"
      :allowNoDocument="true"
      @enrich-form-data="enrichFormData"
      @on-change-document="changeDocument"
    >
      <template v-slot:title>
        {{ $t("cotenantfinancialform.title") }}
      </template>
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
                  'fr-input-group--error': errors[0],
                }"
              >
                <label for="monthlySum" class="fr-label">
                  {{ getMonthlySumLabel() }} :
                </label>
                <input
                  id="monthlySum"
                  :placeholder="
                    $tc('cotenantfinancialform.monthlySum.placeholder')
                  "
                  type="number"
                  min="0"
                  step="1"
                  v-model="financialDocument.monthlySum"
                  name="monthlySum"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': valid,
                    'fr-input--error': errors[0],
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
          <ValidationObserver v-slot="{ validate, valid }">
            <form
              name="customTextForm"
              @submit.prevent="validate().then(goNext())"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="customTextNoDocument">
                  {{ $t("cotenantfinancialform.has-no-income") }}
                </label>
                <textarea
                  v-model="document.customText"
                  maxlength="2000"
                  rows="3"
                  class="form-control fr-input validate-required"
                  :class="{
                    'fr-input--valid': valid,
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
import { UtilsService } from "@/services/UtilsService";

@Component({
  components: {
    NakedCard,
    ValidationObserver,
    ValidationProvider,
    DocumentDownloader,
    FooterContainer,
    BackNext,
  },
})
export default class CoTenantFinancialForm extends Vue {
  @Prop() coTenantId!: number;
  @Prop() financialDocument!: DfDocument;
  @Prop() allowNoIncome!: boolean;

  documentType?: DocumentType;
  document!: DfDocument;
  showDownloader = false;

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
    this.showDownloader = Boolean(
      this.documentType?.key &&
        this.documentType?.key !== "no-income" &&
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

  getMonthlySumLabel() {
    const docType = this.documentType?.key;
    let label = this.$tc("cotenantfinancialform.monthlySum.label");
    if (docType === "salary" || docType === "pension" || docType === "rent") {
      label += " ";
      label += this.$tc("cotenantfinancialform.monthlySum.label-tax");
    }
    return label;
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
        .catch((err) => {
          UtilsService.handleCommonSaveError(err);
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
