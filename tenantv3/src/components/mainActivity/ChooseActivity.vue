<template>
  <p>{{ t(textKey + '.desc') }}</p>
  <RadioList>
    <RadioListItem :to="here + '/cdi'" @click="sendEvent('cdi')">{{
      t('activity.cdi')
    }}</RadioListItem>
    <RadioListItem :to="here + '/cdd'" @click="sendEvent('cdd')">{{
      t('activity.cdd')
    }}</RadioListItem>
    <RadioListItem :to="here + '/public'" @click="sendEvent('public')">{{
      t('activity.public')
    }}</RadioListItem>
    <RadioListItem :to="here + '/independant'" @click="sendEvent('independent')">{{
      t('activity.self-employed')
    }}</RadioListItem>
    <RadioListItem :to="here + '/retraite'" @click="sendEvent('retired')">{{
      t('activity.retired')
    }}</RadioListItem>
    <RadioListItem :to="here + '/chomage'" @click="sendEvent('unemployed')">{{
      t('activity.unemployed')
    }}</RadioListItem>
    <RadioListItem :to="here + '/etudes'" @click="sendEvent('student')">{{
      t('activity.student')
    }}</RadioListItem>
    <RadioListItem :to="here + '/alternance'" @click="sendEvent('alternation')">{{
      t('activity.alternation')
    }}</RadioListItem>
    <template v-if="showAllItems">
      <RadioListItem :to="here + '/stage'" @click="sendEvent('stage')">{{
        t('activity.stage')
      }}</RadioListItem>
      <RadioListItem :to="here + '/interimaire'" @click="sendEvent('ctt')">{{
        t('activity.ctt')
      }}</RadioListItem>
      <RadioListItem :to="here + '/intermittence'" @click="sendEvent('intermittent')">{{
        t('activity.intermittent')
      }}</RadioListItem>
      <RadioListItem :to="here + '/artiste-auteur'" @click="sendEvent('artist-author')">{{
        t('activity.artist-author')
      }}</RadioListItem>
      <RadioListItem :to="here + '/parent-au-foyer'" @click="sendEvent('stay-at-home-parent')">{{
        t('activity.stay-at-home-parent')
      }}</RadioListItem>
      <RadioListItem :to="here + '/sans-activite'" @click="sendEvent('no-activity')">{{
        t('activity.no-activity')
      }}</RadioListItem>
      <RadioListItem :to="here + '/autre'" @click="sendEvent('other')">{{
        t('activity.other')
      }}</RadioListItem>
    </template>
  </RadioList>
  <DfButton v-if="!showAllItems" class="fr-ml-auto" @click="showAll">{{
    t('activity.show-more')
  }}</DfButton>
  <MainActivityFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '@/services/AnalyticsService'
import { showAllItems, useMainActivityState } from '@/components/mainActivity/lib/mainActivityState'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainActivityFooter from './lib/MainActivityFooter.vue'

const { t } = useI18n()
const { category, textKey } = useMainActivityState()
const route = useRoute()

const here = computed(() => route.path)

const sendEvent = (subcategory: string) => AnalyticsService.selectSituation(category, subcategory)
const showAll = () => {
  AnalyticsService.selectOther(category)
  showAllItems.value = true
}
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
