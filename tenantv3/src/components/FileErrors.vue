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
            <DfButton class="update-btn" @on-click="openTenant(0)">
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
                <DfButton class="update-btn" @on-click="openGuarantor(g, 0)">
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
              <DfButton class="update-btn" @on-click="openGuarantor(g, 1)">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorResidencyValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.residency") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 2)">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'PROFESSIONAL')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.professional") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 3)">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorFinancialValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.financial") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 4)">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!isGuarantorTaxValid(g)">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.tax") }}</div>
              <DfButton class="update-btn" @on-click="openGuarantor(g, 5)">
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
                <DfButton class="update-btn" @on-click="openGuarantor(g, 0)">
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
              <DfButton class="update-btn" @on-click="openGuarantor(g, 1)">
                <span class="desktop">{{ $t("fileerrors.update") }}</span>
                <i class="color--primary ri-pencil-line fs-16 mobile"></i>
              </DfButton>
            </div>
          </div>
          <div v-if="!guarantorHasDoc(g, 'IDENTIFICATION_LEGAL_PERSON')">
            <div class="fr-grid-row file-item">
              <div>{{ $t("fileerrors.representative-identification") }}</div>

              <DfButton class="update-btn" @on-click="openGuarantor(g, 2)">
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
              <DfButton class="update-btn" @on-click="openGuarantor(g, 1)">
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
              <DfButton class="update-btn" @on-click="openTenant(0, tenant)">
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
            <DfButton class="update-btn" @on-click="openTenant(1, tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!isResidencyValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.residency") }}</div>
            <DfButton class="update-btn" @on-click="openTenant(2, tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!hasDoc('PROFESSIONAL', tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.professional") }}</div>
            <DfButton class="update-btn" @on-click="openTenant(3, tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!isFinancialValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.financial") }}</div>
            <DfButton class="update-btn" @on-click="openTenant(4, tenant)">
              <span class="desktop">{{ $t("fileerrors.update") }}</span>
              <i class="color--primary ri-pencil-line fs-16 mobile"></i>
            </DfButton>
          </div>
        </div>
        <div v-if="!isTaxValid(tenant)">
          <div class="fr-grid-row file-item">
            <div>{{ $t("fileerrors.tax") }}</div>
            <DfButton class="update-btn" @on-click="openTenant(5, tenant)">
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
                    @on-click="openGuarantor(g, 0, tenant)"
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
                  @on-click="openGuarantor(g, 1, tenant)"
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
                  @on-click="openGuarantor(g, 2, tenant)"
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
                  @on-click="openGuarantor(g, 3, tenant)"
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
                  @on-click="openGuarantor(g, 4, tenant)"
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
                  @on-click="openGuarantor(g, 5, tenant)"
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
                  @on-click="openGuarantor(g, 1, tenant)"
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
                  @on-click="openGuarantor(g, 2, tenant)"
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
                  @on-click="openGuarantor(g, 1, tenant)"
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

<script setup lang="ts">
import { Guarantor } from "df-shared-next/src/models/Guarantor";
import { User } from "df-shared-next/src/models/User";
import { UtilsService } from "../services/UtilsService";
import NakedCard from "df-shared-next/src/components/NakedCard.vue";
import DfButton from "df-shared-next/src/Button/Button.vue";
import useTenantStore from "@/stores/tenant-store";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const store = useTenantStore();
const user = computed(() => store.user);
const router = useRouter();

  const coTenants = ref([] as User[]);

  onBeforeMount(() => {
    coTenants.value = user.value.apartmentSharing?.tenants.filter(
      (t: User) => t.id != user.value?.id
    ) as User[];
  })

  function hasDoc(docType: string, user?: User) {
    return store.hasDoc(docType, user);
  }

  function isResidencyValid(user?: User) {
    return store.isTenantDocumentValid("RESIDENCY", user);
  }

  function isFinancialValid(user?: User) {
    return store.isTenantDocumentValid("FINANCIAL", user);
  }

  function isTaxValid(user?: User) {
    return store.isTenantDocumentValid("TAX", user);
  }

  function guarantorHasDoc(g: Guarantor, docType: string) {
    return UtilsService.guarantorHasDoc(docType, g);
  }

  function isGuarantorResidencyValid(g: Guarantor) {
    return UtilsService.isGuarantorDocumentValid("RESIDENCY", g);
  }

  function isGuarantorFinancialValid(g: Guarantor) {
    return UtilsService.isGuarantorDocumentValid("FINANCIAL", g);
  }

  function isGuarantorTaxValid(g: Guarantor) {
    return UtilsService.isGuarantorDocumentValid("TAX", g);
  }

  function namesFilled(userParam?: User) {
    const u = userParam ? userParam : user.value;
    return u?.firstName && u?.lastName;
  }

  function documentsFilled(user?: User) {
    return store.documentsFilled(user);
  }

  function namesGuarantorFilled(g: Guarantor) {
    return (
      (g.typeGuarantor === "NATURAL_PERSON" && g.firstName && g.lastName) ||
      (g.typeGuarantor === "LEGAL_PERSON" && g.legalPersonName) ||
      g.typeGuarantor === "ORGANISM"
    );
  }

  function documentsGuarantorFilled(g: Guarantor) {
    return store.guarantorDocumentsFilled(g);
  }

  function openTenant(substep: number, user?: User) {
    if (user) {
      router.push({
        name: "CoTenantDocuments",
        params: { substep: substep, tenantId: user.id.toString(), step: "4" },
      });
      return;
    }
    if (substep == 0) {
      router.push({
        name: "TenantName",
      });
    } else {
      router.push({
        name: "TenantDocuments",
        params: { substep: substep },
      });
    }
  }

  async function openGuarantor(g: Guarantor, substep: number, tenant?: User) {
    const page = await store.setGuarantorPage( g, substep, tenant?.id);
    router.push(page)
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
