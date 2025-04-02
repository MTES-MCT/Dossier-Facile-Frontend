<template>
  <RadioList>
    <RadioListItem
      :to="'nom-locataire/pour-moi'"
      @click="AnalyticsService.tenantIdentitySelectSelf()"
    >
      {{ t('identity.self') }}
      <HintText>{{ t('identity.self-hint') }}</HintText>
    </RadioListItem>
    <RadioListItem
      :to="'nom-locataire/pour-une-autre-personne'"
      @click="AnalyticsService.tenantIdentitySelectThirdParty()"
    >
      {{ t('identity.third-party') }}
      <HintText>{{ t('identity.third-party-hint') }}</HintText>
    </RadioListItem>
  </RadioList>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RadioList from '../common/RadioList.vue'
import RadioListItem from '../common/RadioListItem.vue'
import HintText from '../common/HintText.vue'
import { AnalyticsService } from '@/services/AnalyticsService'

const { t } = useI18n()
</script>

<i18n>
    {
      "en": {
        "identity": {
            "self": "For you",
            "self-hint": "You are the future tenant",
            "third-party": "For someone else",
            "third-party-hint": "Your child, your employee, ..."
        }
      },
      "fr": {
        "identity": {
            "self": "Pour vous",
            "self-hint": "Vous êtes le futur locataire",
            "third-party": "Pour une autre personne",
            "third-party-hint": "Votre enfant, votre employé, ..."
        }
      }
    }
</i18n>
