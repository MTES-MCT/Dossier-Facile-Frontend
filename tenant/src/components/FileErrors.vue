<template>
  <div>
    <NakedCard class="fr-mt-3w fr-p-md-5w" v-if="!documentsFilled()">
      <div class="fr-text--bold">{{ $t("my-invalid-document") }}</div>
      <div v-if="!hasDoc('IDENTIFICATION')">
        <div class="fr-grid-row file-item">
          <div>{{ $t("identification") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(1)">
            <div v-if="!isMobile()">{{ $t("update") }}</div>
            <div v-if="isMobile()">
              <span class="color--primary material-icons md-16">edit</span>
            </div>
          </DfButton>
        </div>
      </div>
      <div v-if="!hasDoc('RESIDENCY')">
        <div class="fr-grid-row file-item">
          <div>{{ $t("residency") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(2)"
            ><div v-if="!isMobile()">{{ $t("update") }}</div>
            <div v-if="isMobile()">
              <span class="color--primary material-icons md-16">edit</span>
            </div></DfButton
          >
        </div>
      </div>
      <div v-if="!hasDoc('PROFESSIONAL')">
        <div class="fr-grid-row file-item">
          <div>{{ $t("professional") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(3)"
            ><div v-if="!isMobile()">{{ $t("update") }}</div>
            <div v-if="isMobile()">
              <span class="color--primary material-icons md-16">edit</span>
            </div></DfButton
          >
        </div>
      </div>
      <div v-if="!isFinancialValid()">
        <div class="fr-grid-row file-item">
          <div>{{ $t("financial") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(4)"
            ><div v-if="!isMobile()">{{ $t("update") }}</div>
            <div v-if="isMobile()">
              <span class="color--primary material-icons md-16">edit</span>
            </div></DfButton
          >
        </div>
      </div>
      <div v-if="!isTaxValid()">
        <div class="fr-grid-row file-item">
          <div>{{ $t("tax") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(5)"
            ><div v-if="!isMobile()">{{ $t("update") }}</div>
            <div v-if="isMobile()">
              <span class="color--primary material-icons md-16">edit</span>
            </div></DfButton
          >
        </div>
      </div>
    </NakedCard>

    <div class="fr-mt-3w" v-for="g in user.guarantors" v-bind:key="g.id">
      <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
        <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-md-5w">
          <div class="fr-text--bold">
            {{ $t("my-invalid-document-guarantor") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("identification") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 1)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'RESIDENCY')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("residency") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 2)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'PROFESSIONAL')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("professional") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 3)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
          <div v-if="!isGuarantorFinancialValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("financial") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 4)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
          <div v-if="!isGuarantorTaxValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("tax") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 5)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
        </NakedCard>
      </div>
      <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
        <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
          <div class="fr-text--bold">
            {{ $t("my-invalid-document-guarantor") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("corporation-identification") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 1)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION_LEGAL_PERSON')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("representative-identification") }}</div>

              <DfButton class="update-btn" @on-click="openGuarantor(g, 2)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
        </NakedCard>
      </div>
      <div v-if="g.typeGuarantor === 'ORGANISM'">
        <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
          <div class="fr-text--bold">
            {{ $t("my-invalid-document-guarantor") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("organism-cert") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 1)"
                ><div v-if="!isMobile()">{{ $t("update") }}</div>
                <div v-if="isMobile()">
                  <span class="color--primary material-icons md-16">edit</span>
                </div></DfButton
              >
            </div>
          </div>
        </NakedCard>
      </div>
    </div>

    <div v-for="(tenant, k) in coTenants" :key="k">
      <NakedCard class="fr-mt-3w fr-p-md-5w" v-if="!documentsFilled(tenant)">
        <div class="fr-text--bold">{{ $t("tenant-invalid-document") }}</div>
        <div v-if="!hasDoc('IDENTIFICATION', tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("identification") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('1', tenant)">
              <div v-if="!isMobile()">{{ $t("update") }}</div>
              <div v-if="isMobile()">
                <span class="color--primary material-icons md-16">edit</span>
              </div>
            </DfButton>
          </div>
        </div>
        <div v-if="!hasDoc('RESIDENCY', tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("residency") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('2', tenant)"
              ><div v-if="!isMobile()">{{ $t("update") }}</div>
              <div v-if="isMobile()">
                <span class="color--primary material-icons md-16">edit</span>
              </div></DfButton
            >
          </div>
        </div>
        <div v-if="!hasDoc('PROFESSIONAL', tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("professional") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('3', tenant)"
              ><div v-if="!isMobile()">{{ $t("update") }}</div>
              <div v-if="isMobile()">
                <span class="color--primary material-icons md-16">edit</span>
              </div></DfButton
            >
          </div>
        </div>
        <div v-if="!isFinancialValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("financial") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('4', tenant)"
              ><div v-if="!isMobile()">{{ $t("update") }}</div>
              <div v-if="isMobile()">
                <span class="color--primary material-icons md-16">edit</span>
              </div></DfButton
            >
          </div>
        </div>
        <div v-if="!isTaxValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("tax") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('5', tenant)"
              ><div v-if="!isMobile()">{{ $t("update") }}</div>
              <div v-if="isMobile()">
                <span class="color--primary material-icons md-16">edit</span>
              </div></DfButton
            >
          </div>
        </div>
      </NakedCard>

      <div class="fr-mt-3w" v-for="g in tenant.guarantors" v-bind:key="g.id">
        <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
          <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-md-5w">
            <div class="fr-text--bold">
              {{ $t("tenant-invalid-document-guarantor") }}
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("identification") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 1, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
            <div v-if="!guarantorHasDoc(g, 'RESIDENCY')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("residency") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 2, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
            <div v-if="!guarantorHasDoc(g, 'PROFESSIONAL')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("professional") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 3, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
            <div v-if="!isGuarantorFinancialValid(g)">
              <div class="fr-grid-row file-item">
                <div>{{ $t("financial") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 4, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
            <div v-if="!isGuarantorTaxValid(g)">
              <div class="fr-grid-row file-item">
                <div>{{ $t("tax") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 5, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
          </NakedCard>
        </div>
        <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
          <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
            <div class="fr-text--bold">
              {{ $t("tenant-invalid-document-guarantor") }}
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("corporation-identification") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 1, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION_LEGAL_PERSON')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("representative-identification") }}</div>

                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 2, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
          </NakedCard>
        </div>
        <div v-if="g.typeGuarantor === 'ORGANISM'">
          <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
            <div class="fr-text--bold">
              {{ $t("tenant-invalid-document-guarantor") }}
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("organism-cert") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, 1, tenant)"
                >
                  <div v-if="!isMobile()">{{ $t("update") }}</div>
                  <div v-if="isMobile()">
                    <span class="color--primary material-icons md-16"
                      >edit</span
                    >
                  </div></DfButton
                >
              </div>
            </div>
          </NakedCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Guarantor } from "df-shared/src/models/Guarantor";
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { UtilsService } from "../services/UtilsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import DfButton from "df-shared/src/Button/Button.vue";
@Component({
  components: { NakedCard, DfButton },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class FileErrors extends Vue {
  user!: User;
  coTenants?: User[];

  beforeMount() {
    this.coTenants = this.user.apartmentSharing?.tenants.filter(
      (t: User) => t.id != this.user?.id
    ) as User[];
  }

  hasDoc(docType: string, user?: User) {
    return UtilsService.hasDoc(docType, user);
  }

  isFinancialValid(user?: User) {
    return UtilsService.isFinancialValid(user);
  }

  isTaxValid(user?: User) {
    return UtilsService.isTaxValid(user);
  }

  guarantorHasDoc(g: Guarantor, docType: string) {
    return UtilsService.guarantorHasDoc(docType, g);
  }

  isGuarantorFinancialValid(g: Guarantor) {
    return UtilsService.isGuarantorFinancialValid(g);
  }

  isGuarantorTaxValid(g: Guarantor) {
    return UtilsService.isGuarantorTaxValid(g);
  }

  documentsFilled(user?: User) {
    return UtilsService.documentsFilled(user);
  }

  documentsGuarantorFilled(g: Guarantor) {
    return UtilsService.guarantorDocumentsFilled(g);
  }

  getGuarantorName(g: Guarantor) {
    if (g.lastName || g.firstName) {
      return g.lastName + " " + g.firstName;
    }
    return "";
  }

  openTenant(substep: string, user?: User) {
    if (user) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: { substep: substep, tenantId: user.id.toString(), step: "4" }
      });
      return;
    }
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: substep }
    });
  }

  openGuarantor(g: Guarantor, substep: string, tenant?: User) {
    this.$store.dispatch("setGuarantorPage", {
      guarantor: g,
      substep: substep,
      tenantId: tenant?.id.toString()
    });
  }

  isMobile() {
    return UtilsService.isMobile();
  }
}
</script>

<style scoped lang="scss">
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--g200);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem;
  flex-wrap: nowrap;
}

.update-btn {
  @media all and (min-width: 768px) {
    min-width: 150px;
    justify-content: center;
  }
  @media all and (max-width: 767px) {
    padding: 0.5rem;
    min-height: 1rem;
    line-height: 1rem;
  }
}
</style>

<i18n>
{
	"en": {
		"identification": "Identification",
		"professional": "Professional",
		"residency": "Residency",
		"financial": "Financial",
		"tax": "Tax",
    "file-not-valid": "Your file is not valid, please complete the missing documents to submit your file",
    "error-title": "File not complete",
    "error-title-guarantor": "Guarantor file not complete",
    "his-missing-documents": "Guarantor missing documents:",
    "update": "Update",
    "organism-cert": "Organism certificate",
    "corporation-identification": "Identité de la personne morale",
    "representative-identification": "Identité du représentant de la personne morale",
    "my-invalid-document" : " my invalid documents:",
    "my-invalid-document-guarantor" : " Guarantor invalid documents:",
    "tenant-invalid-document" : "Cotenant Guarantor invalid documents:",
    "tenant-invalid-document-guarantor" : "Cotenant Guarantor invalid documents:"
	},
	"fr": {
		"identification": "Pièce d'identité",
		"residency": "Justificatif de domicile",
		"professional": "Justificatif de situation professionnelle",
		"financial": "Justificatif de ressources",
		"tax": "Avis d'imposition",
    "file-not-valid": "Votre dossier n'est pas valide, veuillez compléter les documents manquants ou modifier les documents refusés pour soumettre votre dossier",
    "error-title": "Dossier invalide",
    "error-title-guarantor": "Dossier garant invalide",
    "his-missing-documents": "Ses documents invalides :",
    "update": "Mettre à jour",
    "organism-cert": "Attestation de garantie",
    "representative-identification": "Identité du représentant de la personne morale",
    "corporation-identification": "Identité de la personne morale",
    "my-invalid-document" : "Mes documents invalides :",
    "my-invalid-document-guarantor" : "Les documents invalides de mon garant :",
    "tenant-invalid-document" : "Les documents invalides de mon conjoint :",
    "tenant-invalid-document-guarantor" : "Les documents invalides du garant de mon conjoint :"
	}
}
</i18n>
