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
            <p v-html="t('tenantguarantorchoice.optional-guarantor')"></p>
            <div class="fr-alert fr-alert--info">
              <p v-html="t('tenantguarantorchoice.two-guarantors-warning')"></p>
            </div>
          </div>
        </NakedCard>
        <NakedCard class="fr-p-md-5w fr-mt-md-3w">
          <GuarantorTypeSelector
            :local-storage-key="`cotenantGuarantorType_${tenantId}`"
            :is-cotenant="isCotenant"
            @selected="tmpGuarantorType = $event"
          >
            <span style="font-weight: normal">{{ t('tenantguarantorchoice.ask-guarantor') }}</span>
          </GuarantorTypeSelector>
        </NakedCard>
        <div v-if="tmpGuarantorType === 'NO_GUARANTOR'" class="bg-purple fr-mt-3w fr-mb-5w fr-p-5w">
          <div class="fr-grid-row space-between">
            <div class="fr-h5">
              {{ t('tenantguarantorchoice.visale-title') }}
            </div>
            <img alt="logo visale" class="logo-visale" src="../assets/visale.svg" />
          </div>
          <p>{{ t('tenantguarantorchoice.visale-text') }}</p>
          <div style="text-align: right">
            <DfButton :primary="true" @click="gotoVisale()">
              {{ t('tenantguarantorchoice.visale-btn') }}
            </DfButton>
          </div>
        </div>
      </div>

      <GuarantorFooter ref="footer" @on-back="goBack" @on-next="setGuarantorType"></GuarantorFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import GuarantorTypeSelector from '@/components/GuarantorTypeSelector.vue'
import { onBeforeMount, onUpdated, ref, useTemplateRef } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { toast } from './toast/toastUtils'

const props = withDefaults(
  defineProps<{
    tenantId: number
    isCotenant?: boolean
  }>(),
  {
    isCotenant: false
  }
)
const emit = defineEmits<{ 'on-back': []; 'on-select': [guarantorType: string] }>()
const footer = useTemplateRef('footer')
const store = useTenantStore()
const { t } = useI18n()

const tmpGuarantorType = ref('')
const guarantorbodycontent = ref()

onBeforeMount(() => {
  store.updateSelectedGuarantor(props.tenantId)
})

onUpdated(() => {
  scrollToEnd()
})

function scrollToEnd() {
  guarantorbodycontent.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function setGuarantorType() {
  if (!tmpGuarantorType.value) {
    toast.error(
      t('tenantguarantorchoice.type-required'),
      document.getElementById('natural-person-choice')
    )
    return
  }
  AnalyticsService.addGuarantor(tmpGuarantorType.value)
  if (tmpGuarantorType.value === 'NO_GUARANTOR') {
    emit('on-select', tmpGuarantorType.value)
  } else {
    store
      .setGuarantorType({
        tenantId: props.tenantId.toString(),
        typeGuarantor: tmpGuarantorType.value
      })
      .then(
        () => {
          emit('on-select', tmpGuarantorType.value)
        },
        () => {
          toast.error(t('tenantguarantorchoice.try-again'), footer.value?.button)
        }
      )
  }
}

function goBack() {
  emit('on-back')
}

function gotoVisale() {
  window.open('https://www.visale.fr', '_blank')
}
</script>

<style scoped lang="scss">
.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}
</style>
