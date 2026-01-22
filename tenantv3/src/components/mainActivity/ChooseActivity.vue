<template>
  <p>{{ t(textKey + '.desc') }}</p>
  <RadioList :list-items="optionLinks" @analytics="sendEvent" />
  <DfButton v-if="!showAllItems" class="fr-ml-auto" @click="showAll">{{
    t('activity.show-more')
  }}</DfButton>
  <MainActivityFooter />
</template>

<script setup lang="ts">
import RadioList, { type optionLink } from '@/components/common/RadioList.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { showAllItems, useMainActivityState } from '@/components/mainActivity/lib/mainActivityState'
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import MainActivityFooter from './lib/MainActivityFooter.vue'

const { t } = useI18n()
const { category, textKey } = useMainActivityState()
const route = useRoute()

const here = computed(() => route.path)

const showAll = () => {
  AnalyticsService.selectOther(category)
  showAllItems.value = true
}

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)

const optionLinks: ComputedRef<optionLink[]> = computed(() => [
  {
    to: `${here.value}/cdi`,
    title: t('activity.cdi'),
    event: 'cdi'
  },
  {
    to: `${here.value}/cdd`,
    title: t('activity.cdd'),
    event: 'cdd'
  },
  {
    to: `${here.value}/public`,
    title: t('activity.public'),
    event: 'public'
  },
  {
    to: `${here.value}/independant`,
    title: t('activity.self-employed'),
    event: 'independent'
  },
  {
    to: `${here.value}/retraite`,
    title: t('activity.retired'),
    event: 'retired'
  },
  {
    to: `${here.value}/chomage`,
    title: t('activity.unemployed'),
    event: 'unemployed'
  },
  {
    to: `${here.value}/etudes`,
    title: t('activity.student'),
    event: 'student'
  },
  {
    to: `${here.value}/alternance`,
    title: t('activity.alternation'),
    event: 'alternation'
  },
  {
    to: `${here.value}/stage`,
    title: t('activity.stage'),
    event: 'stage',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/interimaire`,
    title: t('activity.ctt'),
    event: 'ctt',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/intermittence`,
    title: t('activity.intermittent'),
    event: 'intermittent',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/artiste-auteur`,
    title: t('activity.artist-author'),
    event: 'artist-author',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/parent-au-foyer`,
    title: t('activity.stay-at-home-parent'),
    event: 'stay-at-home-parent',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/sans-activite`,
    title: t('activity.no-activity'),
    event: 'no-activity',
    condition: showAllItems.value
  },
  {
    to: `${here.value}/autre`,
    title: t('activity.other'),
    event: 'other',
    condition: showAllItems.value
  }
])
</script>

<i18n>
{
  "en": {
    "activity": {
      "cdi": "Permanent Contract",
      "cdd": "Fixed-term Contract",
      "public": "Civil servant",
      "self-employed": "Self-employed",
      "retired": "Retired",
      "unemployed": "Unemployed",
      "student": "Studies",
      "alternation": "Alternating",
      "show-more": "Other activities…",
      "stage": "Internship",
      "ctt": "Temporary Work Contract",
      "intermittent": "Intermittent",
      "artist-author": "Artist-author",
      "stay-at-home-parent": "Stay-at-home parent",
      "no-activity": "No activity",
      "other": "Autre"
    },
    "tenant": {
      "desc": "Do you have several activities? Please select your main activity below. You can add different types of income in the Income section.",
    },
    "couple": {
      "desc": "Does your spouse have several activities? Please select their main activity below. You can add different types of income in the Income section.",
    },
    "guarantor": {
      "desc": "Does your guarantor have several activities? Please select their main activity below. You can add different types of income in the Income section.",
    },
    "couple-guarantor": {
      "desc": "Does your spouse's guarantor have several activities? Please select their main activity below. You can add different types of income in the Income section.",
    }
  },
  "fr": {
    "activity": {
      "cdi": "CDI",
      "cdd": "CDD",
      "public": "Fonctionnaire",
      "self-employed": "Indépendant",
      "retired": "Retraite",
      "unemployed": "Chômage",
      "student": "Études",
      "alternation": "Alternance",
      "show-more": "Autres activités…",
      "stage": "Stage",
      "ctt": "Intérimaire",
      "intermittent": "Intermittence",
      "artist-author": "Artiste-auteur",
      "stay-at-home-parent": "Parent au foyer",
      "no-activity": "Sans activité",
      "other": "Autre"
    },
    "tenant": {
      "desc": "Vous avez plusieurs activités ? Veuillez choisir votre activité principale ci-dessous. Vous pourrez ajouter différents types de revenus dans la rubrique Revenus."
    },
    "guarantor": {
      "desc": "Votre garant a plusieurs activités ? Veuillez choisir son activité principale ci-dessous. Vous pourrez ajouter différents types de revenus dans la rubrique Revenus.",
    },
    "couple": {
      "desc": "Votre conjoint a plusieurs activités ? Veuillez choisir son activité principale ci-dessous. Vous pourrez ajouter différents types de revenus dans la rubrique Revenus."
    },
    "couple-guarantor": {
      "desc": "Le garant de votre conjoint a plusieurs activités ? Veuillez choisir son activité principale ci-dessous. Vous pourrez ajouter différents types de revenus dans la rubrique Revenus."
    }
  }
}
</i18n>
