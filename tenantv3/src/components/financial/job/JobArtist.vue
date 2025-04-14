<template>
  <BackLinkRow :label="t('form.financial.job-income')" :to="grandparent" category="travail" />
  <BackLinkRow
    :label="t('artist-author.' + textKey)"
    :to="parent"
    category="travail"
    step="artiste-auteur"
  />
  <EnterMonthlyIncomeBeforeTax />
  <UploadFilesFinancial category="SALARY" step="SALARY_ARTIST_AUTHOR">
    <template #emptyIncome>
      <AlertAverageIncome />
    </template>
    <template #incomeFilled>
      <AlertAverageIncome class="fr-mb-3w" />
      <i18n-t :keypath="'please-provide-' + suffix" tag="p">
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
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import AlertAverageIncome from './AlertAverageIncome.vue'
import EnterMonthlyIncomeBeforeTax from '../lib/EnterMonthlyIncomeBeforeTax.vue'
import { useI18n } from 'vue-i18n'
import { useFinancialState } from '../financialState'

const { t } = useI18n()
const parent = useParentRoute()
const grandparent = useParentRoute(2)
const { suffix, textKey } = useFinancialState()
</script>

<i18n>
{
  "en": {
    "artist-author": {
      "tenant": "You are artist-author",
      "guarantor": "Your guarantor is an artist-author",
      "couple": "Your spouse is an artist-author",
      "couple-guarantor": "Their spouse is an are artist-author",
    },
    "please-provide": "Please provide their most recent {declaration}. This document can be found on your {website}. If you don't have it, you can provide their latest tax notice.",
    "income-declaration": "declaration of income and activity",
    "website-space": "artist-author space on the Urssaf website"
  },
  "fr": {
    "artist-author": {
      "tenant": "Vous êtes artiste-auteur",
      "guarantor": "Votre garant est artiste-auteur",
      "couple": "Votre conjoint est artiste-auteur",
      "couple-guarantor": "Son garant est artiste-auteur",
    },
    "please-provide-tenant": "Veuillez fournir votre {declaration} la plus récente. Ce document se trouve sur votre {website}. Si vous ne l’avez pas, vous pouvez fournir votre dernier avis d’imposition.",
    "please-provide-other": "Veuillez fournir sa {declaration} la plus récente. Ce document se trouve sur votre {website}. Si vous ne l’avez pas, vous pouvez fournir son dernier avis d’imposition.",
    "income-declaration": "déclaration de revenus et d’activité",
    "website-space": "espace artiste-auteur du site de l’Urssaf"
  }
}
</i18n>
