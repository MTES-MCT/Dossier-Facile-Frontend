<template>
  <p>{{ t('your-situation') }}</p>
  <BackLinkRow :label="t('not-provided')" :to="parent" />
  <DsfrAlert type="warning" small>
    <p>{{ t('info-bloc') }}</p>
  </DsfrAlert>
  <TaxFooter />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/TaxBackLinkRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import TaxFooter from './lib/TaxFooter.vue'

const { t } = useI18n()
const parent = useParentRoute()
</script>

<i18n>
{
  "en": {
    "your-situation": "Your situation:",
    "not-provided": "Not provided",
    "info-bloc": "The tax assessment stage has evolved and certain categories have changed. Your document may appear as 'not filled in'. You can reclassify it by clicking on 'Modify'."
  },
  "fr": {
    "your-situation": "Votre situation :",
    "not-provided": "Non renseigné",
    "info-bloc": "L’étape avis d’imposition a évolué et certaines catégories ont changé. Votre document peut apparaître en “non renseigné”. Vous pouvez le reclasser en cliquant sur “Modifier”."
  }
}
</i18n>
