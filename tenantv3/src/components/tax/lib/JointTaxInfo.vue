<template>
  <DsfrAlert type="info" small>
    <p>{{ t('info.proceed') }}</p>
    <ul>
      <li>
        <strong>{{ t('info.if-married') }}</strong>
        <span>{{ t('info.add-joint-notice') }}</span>
      </li>
      <li>
        <strong>{{ t('info.if-separated') }}</strong>
        <span>{{ t('info.provide-notice') }}</span>
      </li>
    </ul>
    <i18n-t tag="p" keypath="info.select">
      <RouterLink :to="parent + '/avec-avis'" class="text-bold"
        >"{{ t('info.you-have-notice') }}"</RouterLink
      >
    </i18n-t>
  </DsfrAlert>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'

defineProps<{ parent: string }>()

const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "info": {
        "proceed": "The tax notice may be joint (couple, ex-spouse). Here's how to proceed:",
        "if-married": "If you are married or in a civil partnership: ",
        "if-separated": "If you are separated or divorced: ",
        "add-joint-notice": "each spouse must add the joint tax notice to their account",
        "provide-notice": "provide the available notice even if it is in both names.",
        "select": "In this case, select {0}",
        "you-have-notice": "You have a tax notice"
    }
  },
  "fr": {
    "info": {
        "proceed": "L'avis d'imposition peut être commun (couple, ex-conjoint). Voici comment procéder :",
        "if-married": "Si vous êtes marié ou pacsé : ",
        "if-separated": "Si vous êtes séparé ou divorcé : ",
        "add-joint-notice": "chaque époux doit ajouter l'avis d'imposition commun dans son espace",
        "provide-notice": "fournissez l'avis disponible même s'il est au nom des deux",
        "select": "Dans ce cas, choisissez {0}",
        "you-have-notice": "Vous avez un avis d’imposition"
    }
  }
}
</i18n>
