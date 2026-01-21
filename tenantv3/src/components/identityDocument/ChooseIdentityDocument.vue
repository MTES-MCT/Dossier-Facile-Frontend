<template>
  <RadioList>
    <p>
      {{ t('submit-identity-document') }} <strong>{{ t('valid-doc') }}</strong>
    </p>
    <RadioListItem :to="here + '/carte'" @click="sendEvent('identity-card')">
      {{ t('identity-card') }}
      <HintText>{{ t('french-or-foreign-f') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/passeport'" @click="sendEvent('passport')"
      >{{ t('passport') }}
      <HintText>{{ t('french-or-foreign') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/titre-sejour'" @click="sendEvent('permit')"
      >{{ t('permit') }}
    </RadioListItem>
    <RadioListItem :to="here + '/permis-conduire'" @click="sendEvent('drivers-licence')"
      >{{ t('drivers-license') }}
      <HintText>{{ t('french-or-foreign') }}</HintText>
    </RadioListItem>
    <RadioListItem :to="here + '/france-identite'" @click="sendEvent('france-identite')"
      >{{ t('france-identite') }}
    </RadioListItem>
    <RadioListItem :to="here + '/autre'" @click="sendEvent('other')"
      >{{ t('other-doc') }}
    </RadioListItem>
  </RadioList>
  <IdentificationFooter />
</template>

<script setup lang="ts">
import RadioList from '@/components/common/RadioList.vue'
import RadioListItem from '@/components/common/RadioListItem.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import HintText from '../common/HintText.vue'
import IdentificationFooter from './lib/IdentificationFooter.vue'

const { t } = useI18n()
const route = useRoute()

const here = computed(() => route.path)
const sendEvent = (subcategory: string) =>
  AnalyticsService.selectSituation('identification', subcategory)
</script>

<i18n>
{
  "en": {
    "submit-identity-document": "Submit a {0} identity document",
    "valid-doc": "valid",
    "other-doc": "Other document",
    "french-or-foreign": "French or foreign",
    "french-or-foreign-f": "French or foreign",
  },
  "fr": {
    "submit-identity-document": "Déposez une pièce d’identité {0}",
    "valid-doc": "en cours de validité",
    "other-doc": "Autre document",
    "french-or-foreign": "Français ou étranger",
    "french-or-foreign-f": "Française ou étrangère",
  }
}
</i18n>
