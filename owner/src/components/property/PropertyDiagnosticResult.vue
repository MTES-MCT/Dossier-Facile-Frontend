<template>
  <NakedCard v-if="dpe">
    <hr />
    <div class="dpe-number-container">
      <div>
        <div class="label">{{ t("propertydiagnosticresult.dpe.number") }}</div>
        <div class="dpe-number">
          <strong>{{ dpe.numero }}</strong>
        </div>
      </div>
      <div>
        <Button
          @onClick="deleteDpe"
          :title="t('propertydiagnosticresult.dpe.delete')"
          :tertiaryNoOutline="true"
          class="fr-icon-delete-fill fr-btn--icon-right"
          >{{ t("propertydiagnosticresult.dpe.delete") }}</Button
        >
      </div>
    </div>
    <hr />
    <div class="dpe-address-container">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-lg-8">
          <strong>{{ dpe.adresse }}, {{ dpe.codePostal }} {{ dpe.commune }}</strong>
        </div>
        <DpeDiagram
          class="fr-col-3 fr-col-lg-2"
          v-if="dpe?.statut !== 'EXPIRE'"
          :short="true"
          :letter="energyLetter"
          :consumption="energyConsumption"
        ></DpeDiagram>
        <DpeCo2Diagram
          class="fr-col-3 fr-col-lg-2"
          v-if="dpe?.statut !== 'EXPIRE'"
          :short="true"
          :letter="co2Letter"
          :consumption="co2Emission"
        ></DpeCo2Diagram>
      </div>
      <div class="fr-grid-row fr-mt-2w">
        <div class="flex--1">
          <div class="label">{{ t("propertydiagnosticresult.dpe.status") }}</div>
          <div :class="{ 'color--red': dpe?.statut !== 'ACTIF' }"><strong>{{ t(dpe.statut) }}</strong></div>
        </div>
        <div class="flex--1">
          <div class="label">{{ t("propertydiagnosticresult.dpe.date") }}</div>
          <div>
          <strong>
            <time>{{ formatDate(dpe.dateRealisation) }}</time>
          </strong>
          </div>
        </div>
        <div class="break"></div>
        <div class="flex--1 fr-mt-2w">
          <div class="label">{{ t("propertydiagnosticresult.dpe.validity-date") }}</div>
          <div :class="{ 'color--red': dpe?.statut !== 'ACTIF' }">
          <strong>
            <time>{{ formatDate(dpe.dateFinValidite) }}</time>
          </strong>
          </div>
        </div>
        <div class="break"></div>
        <div class="flex--1 fr-mt-2w" v-if="dpe.statut === 'REMPLACE'">
          <div class="label">
            {{ t("propertydiagnosticresult.dpe.replacement-number") }}
          </div>
          <div><strong>{{ dpe.numeroDPERemplacant }}</strong></div>
        </div>
      </div>
      <hr />
    </div>
    <div class="dpe-replaced-container" v-if="dpe.statut === 'REMPLACE'">
      <div class="display--flex">
        <div class="flex--1">
          <div class="label">{{ t("propertydiagnosticresult.dpe.replaced-number") }}</div>
          <div><strong>{{ dpe.numero }}</strong></div>
        </div>
        <div class="flex--1">
          <div class="label">
            {{ t("propertydiagnosticresult.dpe.replaced-number-reason") }}
          </div>
          <div v-if="dpe.motifRemplacement"><strong>{{ dpe.motifRemplacement }}</strong></div>
          <div v-if="!dpe.motifRemplacement"><strong>N/A</strong></div>
        </div>
      </div>
      <hr />
    </div>
    <div class="property-details-container">
      <div class="fr-grid-row">
        <div class="flex--1">
          <div class="label">
          {{ t("propertydiagnosticresult.dpe.property-type") }}</div>
          <div><strong>{{ dpe.typeBatiment }}</strong></div>
        </div>
        <div class="flex--1">
          <div class="label">{{ t("propertydiagnosticresult.dpe.year-construction") }}</div>
          <div><strong>{{ dpe.anneeConstruction }}</strong></div>
        </div>
        <div class="break"></div>
        <div class="flex--1 fr-mt-2w">
          <div class="label">{{ t("propertydiagnosticresult.dpe.living-space") }}</div>
          <div><strong>{{ dpe.surfaceHabitable }}m²</strong></div>
        </div>
      </div>
      <hr />
    </div>
    <div class="property-result-details-container" v-if="dpe?.statut !== 'EXPIRE'">
      <div class="label">
        {{ t("propertydiagnosticresult.dpe.energetic-performance") }}
      </div>
      <NakedCard>
        <h2 class="fr-h6">
          {{ t("propertydiagnosticresult.dpe.my-dpe-detail") }}:
          <span :class="dpe.etiquetteBilan">{{ dpe.etiquetteBilan }}</span>
        </h2>
      <div class="dpe-container">
        <DpeDiagram
          class="flex--1"
          :letter="energyLetter"
          :consumption="energyConsumption"
        ></DpeDiagram>
        <DpeCo2Diagram
          class="flex--1"
          :letter="co2Letter"
          :consumption="co2Emission"
        ></DpeCo2Diagram>
      </div>
      </NakedCard>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import { Composer, useI18n } from 'vue-i18n';
import Button from 'df-shared-next/src/Button/Button.vue';
import { computed } from 'vue';
import DpeDiagram from 'df-shared-next/src/components/dpe/DpeDiagram.vue';
import DpeCo2Diagram from 'df-shared-next/src/components/dpe/DpeCo2Diagram.vue';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import i18n from '../../i18n';
import UtilsService from '../../services/UtilsService';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();
const store = useOwnerStore();

const props = defineProps<{
  dpe: any;
}>();

const energyConsumption = computed(() => props.dpe.consommation);
const energyLetter = computed(() => UtilsService.getEnergyConsumptionLetter(energyConsumption.value));

const co2Emission = computed(() => props.dpe.emission);
const co2Letter = computed(() => UtilsService.getCO2EmissionLetter(co2Emission.value));

function deleteDpe() {
  store.deleteDpe();
}

function formatDate(d: string) {
  const date = Date.parse(d);
  if (date === undefined || date === null) {
    return '';
  }
  return format(date, 'dd MMMM yyyy', {
    locale: ((i18n.global as unknown) as Composer).locale.value === 'fr' ? fr : enUS,
  });
}
</script>

<style scoped>
  .dpe-number-container {
    display: flex;
    justify-content: space-between;
  }
  .A {
    color: var(--dpe-energy-A);
  }
  .B {
    color: var(--dpe-energy-B);
  }
  .C {
    color: var(--dpe-energy-C);
  }
  .D {
    color: var(--dpe-energy-D);
  }
  .E {
    color: var(--dpe-energy-E);
  }
  .F {
    color: var(--dpe-energy-F);
  }
  .G {
    color: var(--dpe-energy-G);
  }

  .label {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  }

  .dpe-container {
  display: flex;
  @media all and (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
  }

  .break {
    display: none;
    @media all and (max-width: 768px) {
      display: block;
      flex-basis: 100%;
      height: 0;
    }
  }
</style>
