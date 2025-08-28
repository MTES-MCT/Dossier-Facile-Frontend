<template>
  <DsfrAlert type="info" small>
    <p>{{ t('info.proceed') }}</p>
    <ul>
      <li>
        <strong>{{ t(`info.${textKey}.if-married`) }}</strong>
        <span>{{ t('info.add-joint-notice') }}</span>
      </li>
      <li>
        <strong>{{ t(`info.${textKey}.if-separated`) }}</strong>
        <span>{{ t('info.provide-notice') }}</span>
      </li>
    </ul>
    <i18n-t tag="p" keypath="info.select">
      <RouterLink :to="parent + '/avec-avis'" class="text-bold"
        >"{{ t(`info.${textKey}.have-notice`) }}"</RouterLink
      >
    </i18n-t>
  </DsfrAlert>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'

defineProps<{ parent: string }>()

const { t } = useI18n()
const { textKey } = useTaxState()
</script>

<i18n>
{
  "en": {
    "info": {
      "proceed": "The tax notice may be joint (couple, ex-spouse). Here's how to proceed:",
      "add-joint-notice": "each spouse must add the joint tax notice to their account",
      "provide-notice": "provide the available notice even if it is in both names.",
      "select": "In this case, select {0}",
      "tenant": {
        "if-married": "If you are married or in a civil partnership: ",
        "if-separated": "If you are separated or divorced: ",
        "have-notice": "You have a tax notice"
      },
      "guarantor": {
        "if-married": "If your guarantor is married or is in a civil partnership: ",
        "if-separated": "If your guarantor is separated or divorced: ",
        "have-notice": "Your guarantor has a tax notice"
      },
      "couple": {
        "if-married": "If your spouse is married or is in a civil partnership: ",
        "if-separated": "If your spouse is separated or divorced: ",
        "have-notice": "Your spouse has a tax notice"
      },
      "couple-guarantor": {
        "if-married": "If their guarantor is married or is in a civil partnership: ",
        "if-separated": "If their guarantor is separated or divorced: ",
        "have-notice": "Their guarantor has a tax notice"
      },
    }
  },
  "fr": {
    "info": {
      "proceed": "L'avis d'imposition peut être commun (couple, ex-conjoint). Voici comment procéder :",
      "add-joint-notice": "chaque époux doit ajouter l'avis d'imposition commun dans son espace",
      "provide-notice": "fournissez l'avis disponible même s'il est au nom des deux",
      "select": "Dans ce cas, choisissez {0}",
      "tenant": {
        "if-married": "Si vous êtes marié ou pacsé : ",
        "if-separated": "Si vous êtes séparé ou divorcé : ",
        "have-notice": "Vous avez un avis d’imposition",
      },
      "guarantor": {
        "if-married": "Si votre garant est marié ou pacsé : ",
        "if-separated": "Si votre garant est séparé ou divorcé : ",
        "have-notice": "Votre garant a un avis d’impôt",
      },
      "couple": {
        "if-married": "Si votre conjoint est marié ou pacsé : ",
        "if-separated": "Si votre conjoint est séparé ou divorcé : ",
        "have-notice": "Votre conjoint a un avis d’impôt",
      },
      "couple-guarantor": {
        "if-married": "Si son garant est marié ou pacsé : ",
        "if-separated": "Si son garant est séparé ou divorcé : ",
        "have-notice": "Son garant a un avis d’impôt",
      },
    }
  }
}
</i18n>
