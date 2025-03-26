<template>
  <div>
    <div>
      <div ref="guarantorbodycontent">
        <NakedCard class="fr-p-md-5w">
          <div class="text-bold fr-mb-1w">
            <h1 class="fr-h5">
              {{ t('guarantorchoice.add-guarantor') }}
            </h1>
          </div>
          <div class="fr-mt-3w">
            <p v-html="t('guarantorchoice.optional-guarantor')"></p>
            <div class="fr-alert fr-alert--info">
              <p v-html="t('guarantorchoice.two-guarantors-warning')"></p>
            </div>
          </div>
        </NakedCard>
        <NakedCard class="fr-p-md-5w fr-mt-md-3w">
          <div class="fr-mb-2w">
            {{ t('guarantorchoice.ask-guarantor') }}
          </div>

          <GuarantorTypeSelector
            :local-storage-key="`guarantorType_${user.email}`"
            @selected="tmpGuarantorType = $event"
          >
          </GuarantorTypeSelector>
        </NakedCard>
        <div v-if="tmpGuarantorType === 'NO_GUARANTOR'" class="bg-purple fr-mt-3w fr-p-5w">
          <div class="fr-grid-row space-between">
            <div class="fr-h5">{{ t('guarantorchoice.visale-title') }}</div>
            <img alt="logo visale" class="logo-visale" src="../assets/visale.svg" />
          </div>
          <p>{{ t('guarantorchoice.visale-text') }}</p>
          <div style="text-align: right">
            <DfButton :primary="true" @click="gotoVisale()">
              {{ t('guarantorchoice.visale-btn') }}
            </DfButton>
          </div>
        </div>
      </div>

      <GuarantorFooter @on-back="goBack" @on-next="setGuarantorType"></GuarantorFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import GuarantorTypeSelector from '@/components/GuarantorTypeSelector.vue'
import { ToastService } from '@/services/ToastService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount, onUpdated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const store = useTenantStore()
const user = computed(() => store.user)
const guarantor = computed(() => store.guarantor)
const coTenants = computed(() => store.coTenants)

const tmpGuarantorType = ref('')
const guarantorbodycontent = ref()

onUpdated(() => {
  // each dom update involved a scrollToEnd
  scrollToEnd()
})

function scrollToEnd() {
  guarantorbodycontent.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

onBeforeMount(() => {
  store.updateSelectedGuarantor(user.value.id)
})

function goBack() {
  router.push({ name: 'TenantTax' })
}

function setGuarantorType() {
  if (!tmpGuarantorType.value) {
    ToastService.error('guarantorchoice.type-required')
    return
  }
  AnalyticsService.addGuarantor(tmpGuarantorType.value || '')
  if (tmpGuarantorType.value === 'NO_GUARANTOR') {
    if (user.value.applicationType === 'COUPLE') {
      router.push({
        name: 'CoTenantDocuments',
        params: {
          step: '4',
          substep: '0',
          tenantId: coTenants.value[0].id.toString()
        }
      })
    } else {
      router.push({
        name: 'ValidateFile'
      })
    }
  } else if (
    tmpGuarantorType.value != guarantor.value?.typeGuarantor ||
    (user.value.guarantors.length || 0) <= 0
  ) {
    store.setGuarantorType({ typeGuarantor: tmpGuarantorType.value }).then((data) => {
      const guarantorId = data.guarantors.at(-1)?.id
      router.push({ name: 'GuarantorName', params: { guarantorId } })
    })
  } else {
    router.push({
      name: 'GuarantorList'
    })
  }
}

function gotoVisale() {
  window.open('https://www.visale.fr', '_blank')
}
</script>

<style scoped lang="scss">
.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.width--fit-content {
  @media all and (min-width: 768px) {
    width: fit-content;
  }
}
</style>
