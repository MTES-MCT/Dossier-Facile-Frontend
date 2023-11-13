<template>
  <div>
    <NakedCard
      class="fr-mt-3w fr-p-md-5w"
      v-if="!documentsFilled() || !namesFilled()"
    >
      <div v-if="!namesFilled()">
        <div class="fr-text--bold">
          {{ $t("fileerrors.my-invalid-names") }}
        </div>
        <div>
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.user-names") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('0')">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
      </div>

      <div v-if="!documentsFilled()" class="fr-text--bold">
        {{ $t("fileerrors.my-invalid-document") }}
      </div>
      <div v-if="!hasDoc('IDENTIFICATION')">
        <div class="fr-grid-row file-item">
          <div>{{ $t("fileerrors.identification") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(1)">
            <span class="desktop">{{ $t("fileerrors.update") }}</span>
            <i class="color--primary ri-pencil-line fs-16 mobile"></i>
          </DfButton>
        </div>
      </div>
      <div v-if="!isResidencyValid()">
        <div class="fr-grid-row file-item">
          <div>{{ $t("fileerrors.residency") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(2)">
            <span class="desktop">{{ $t("fileerrors.update") }}</span>
            <i class="color--primary ri-pencil-line fs-16 mobile"></i>
          </DfButton>
        </div>
      </div>
      <div v-if="!hasDoc('PROFESSIONAL')">
        <div class="fr-grid-row file-item">
          <div>{{ $t("fileerrors.professional") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(3)">
            <span class="desktop">{{ $t("fileerrors.update") }}</span>
            <i class="color--primary ri-pencil-line fs-16 mobile"></i>
          </DfButton>
        </div>
      </div>
      <div v-if="!isFinancialValid()">
        <div class="fr-grid-row file-item">
          <div>{{ $t("fileerrors.financial") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(4)">
            <span class="desktop">{{ $t("fileerrors.update") }}</span>
            <i class="color--primary ri-pencil-line fs-16 mobile"></i>
          </DfButton>
        </div>
      </div>
      <div v-if="!isTaxValid()">
        <div class="fr-grid-row file-item">
          <div>{{ $t("fileerrors.tax") }}</div>
          <DfButton class="update-btn" @on-click="openTenant(5)">
            <span class="desktop">{{ $t("fileerrors.update") }}</span>
            <i class="color--primary ri-pencil-line fs-16 mobile"></i>
          </DfButton>
        </div>
      </div>
    </NakedCard>

    <div class="fr-mt-3w" v-for="g in user.guarantors" v-bind:key="g.id">
      <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
        <NakedCard
          v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)"
          class="fr-p-md-5w"
        >
          <div v-if="!namesGuarantorFilled(g)">
            <div class="fr-text--bold">
              {{ $t("fileerrors.my-invalid-names-guarantor") }}
            </div>
            <div>
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.user-names") }}</div>
                <DfButton class="update-btn" @on-click="openGuarantor(g, '0')">
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
          </div>
          <div v-if="!documentsGuarantorFilled(g)" class="fr-text--bold">
            {{ $t("fileerrors.my-invalid-document-guarantor") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.identification") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '1')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorResidencyValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.residency") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '2')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'PROFESSIONAL')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.professional") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '3')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorFinancialValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.financial") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '4')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorTaxValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.tax") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '5')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
        </NakedCard>
      </div>
      <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
        <NakedCard
          v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)"
          class="fr-p-5w"
        >
          <div v-if="!namesGuarantorFilled(g)">
            <div class="fr-text--bold">
              {{ $t("fileerrors.my-invalid-names-guarantor") }}
            </div>
            <div>
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.user-names") }}</div>
                <DfButton class="update-btn" @on-click="openGuarantor(g, '0')">
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
          </div>
          <div class="fr-text--bold">
            {{ $t("fileerrors.my-invalid-document-guarantor") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.corporation-identification") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '1')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION_LEGAL_PERSON')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.representative-identification") }}</div>

              <DfButton class="update-btn" @on-click="openGuarantor(g, '2')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
        </NakedCard>
      </div>
      <div v-if="g.typeGuarantor === 'ORGANISM'">
        <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
          <div class="fr-text--bold">
            {{ $t("fileerrors.my-invalid-document-guarantor") }}
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.organism-cert") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, '1')">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
        </NakedCard>
      </div>
    </div>

    <div v-for="(tenant, k) in coTenants" :key="k">
      <NakedCard
        class="fr-mt-3w fr-p-md-5w"
        v-if="
          user.applicationType === 'COUPLE' &&
          (!documentsFilled(tenant) || !namesFilled(tenant))
        "
      >
        <div v-if="!namesFilled(tenant)">
          <div class="fr-text--bold">
            {{ $t("fileerrors.tenant-invalid-names") }}
          </div>
          <div>
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.user-names") }}</div>
              <DfButton class="update-btn" @on-click="openTenant('0', tenant)">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
        </div>

        <div v-if="!documentsFilled(tenant)" class="fr-text--bold">
          {{ $t("fileerrors.tenant-invalid-document") }}
        </div>
        <div v-if="!hasDoc('IDENTIFICATION', tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.identification") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('1', tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!isResidencyValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.residency") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('2', tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!hasDoc('PROFESSIONAL', tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.professional") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('3', tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!isFinancialValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.financial") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('4', tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!isTaxValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.tax") }}</div>
            <DfButton class="update-btn" @on-click="openTenant('5', tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
      </NakedCard>

      <div class="fr-mt-3w" v-for="g in tenant.guarantors" v-bind:key="g.id">
        <div v-if="g.typeGuarantor === 'NATURAL_PERSON'">
          <NakedCard
            v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)"
            class="fr-p-md-5w"
          >
            <div v-if="!namesGuarantorFilled(g)">
              <div class="fr-text--bold">
                {{ $t("fileerrors.tenant-invalid-names-guarantor") }}
              </div>
              <div>
                <div class="fr-grid-row file-item">
                  <div>{{ $t("fileerrors.user-names") }}</div>
                  <DfButton
                    class="update-btn"
                    @on-click="openGuarantor(g, '0', tenant)"
                  >
                    <span class="desktop">{{ $t("fileerrors.update") }}</span>
                    <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                  </DfButton>
                </div>
              </div>
            </div>
            <div v-if="!documentsGuarantorFilled(g)" class="fr-text--bold">
              {{ $t("fileerrors.tenant-invalid-document-guarantor") }}
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.identification") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '1', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
            <div v-if="!guarantorHasDoc(g, 'RESIDENCY')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.residency") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '2', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
            <div v-if="!guarantorHasDoc(g, 'PROFESSIONAL')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.professional") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '3', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
            <div v-if="!isGuarantorFinancialValid(g)">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.financial") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '4', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
            <div v-if="!isGuarantorTaxValid(g)">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.tax") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '5', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
          </NakedCard>
        </div>
        <div v-if="g.typeGuarantor === 'LEGAL_PERSON'">
          <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
            <div class="fr-text--bold">
              {{ $t("fileerrors.tenant-invalid-document-guarantor") }}
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.corporation-identification") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '1', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION_LEGAL_PERSON')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.representative-identification") }}</div>

                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '2', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
              </div>
            </div>
          </NakedCard>
        </div>
        <div v-if="g.typeGuarantor === 'ORGANISM'">
          <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-p-5w">
            <div class="fr-text--bold">
              {{ $t("fileerrors.tenant-invalid-document-guarantor") }}
            </div>
            <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION')">
              <div class="fr-grid-row file-item">
                <div>{{ $t("fileerrors.organism-cert") }}</div>
                <DfButton
                  class="update-btn"
                  @on-click="openGuarantor(g, '1', tenant)"
                >
                  <span class="desktop">{{ $t("fileerrors.update") }}</span>
                  <i class="color--primary ri-pencil-line fs-16 mobile"></i>
                </DfButton>
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
      user: "user",
    }),
  },
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

  isResidencyValid(user?: User) {
    return UtilsService.isTenantDocumentValid("RESIDENCY", user);
  }

  isFinancialValid(user?: User) {
    return UtilsService.isTenantDocumentValid("FINANCIAL", user);
  }

  isTaxValid(user?: User) {
    return UtilsService.isTenantDocumentValid("TAX", user);
  }

  guarantorHasDoc(g: Guarantor, docType: string) {
    return UtilsService.guarantorHasDoc(docType, g);
  }

  isGuarantorResidencyValid(g: Guarantor) {
    return UtilsService.isGuarantorDocumentValid("RESIDENCY", g);
  }

  isGuarantorFinancialValid(g: Guarantor) {
    return UtilsService.isGuarantorDocumentValid("FINANCIAL", g);
  }

  isGuarantorTaxValid(g: Guarantor) {
    return UtilsService.isGuarantorDocumentValid("TAX", g);
  }

  namesFilled(user?: User) {
    const u = user ? user : this.user;
    return u?.firstName && u?.lastName;
  }

  documentsFilled(user?: User) {
    return UtilsService.documentsFilled(user);
  }

  namesGuarantorFilled(g: Guarantor) {
    return (
      (g.typeGuarantor === "NATURAL_PERSON" && g.firstName && g.lastName) ||
      (g.typeGuarantor === "LEGAL_PERSON" && g.legalPersonName) ||
      g.typeGuarantor === "ORGANISM"
    );
  }

  documentsGuarantorFilled(g: Guarantor) {
    return UtilsService.guarantorDocumentsFilled(g);
  }

  openTenant(substep: string, user?: User) {
    if (user) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: { substep: substep, tenantId: user.id.toString(), step: "4" },
      });
      return;
    }
    if (substep == "0") {
      this.$router.push({
        name: "Profile",
      });
    } else {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: substep },
      });
    }
  }

  openGuarantor(g: Guarantor, substep: number, tenant?: User) {
    this.$store.dispatch("setGuarantorPage", {
      guarantor: g,
      substep: substep,
      tenantId: tenant?.id.toString(),
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
