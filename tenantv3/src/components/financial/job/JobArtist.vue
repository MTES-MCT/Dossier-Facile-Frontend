<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" />
  <BackLinkRow :label="t('artist-author')" :to="parent" />
  <EnterMonthlyIncome />
  <UploadFilesFinancial category="SALARY" step="SALARY_ARTIST_AUTHOR">
    <template #emptyIncome>
      <AlertAverageIncome />
    </template>
    <template #incomeFilled>
      <AlertAverageIncome class="fr-mb-3w" />
      <i18n-t keypath="please-provide" tag="p">
        <template #declaration>
          <strong>{{ t('income-declaration') }}</strong>
        </template>
        <template #website>
          <a href="https://www.artistes-auteurs.urssaf.fr/aa/accueil" target="_blank">{{
            t('website-space')
          }}</a>
        </template>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAverageIncome from './AlertAverageIncome.vue'
import EnterMonthlyIncome from './EnterMonthlyIncome.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
</script>

<i18n>
{
  "en": {
    "artist-author": "You are artist-author",
    "please-provide": "Please provide your most recent {declaration}. This document can be found on your {website}. If you don't have it, you can provide your latest tax notice.",
    "income-declaration": "declaration of income and activity",
    "website-space": "artist-author space on the Urssaf website"
  },
  "fr": {
    "artist-author": "Vous êtes artiste-auteur",
    "please-provide": "Veuillez fournir votre {declaration} la plus récente. Ce document se trouve sur votre {website}. Si vous ne l’avez pas, vous pouvez fournir votre dernier avis d’imposition.",
    "income-declaration": "déclaration de revenus et d’activité",
    "website-space": "espace artiste-auteur du site de l’Urssaf"
  }
}
</i18n>
