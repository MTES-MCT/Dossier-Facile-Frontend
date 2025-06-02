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
          <div class="fr-mb-2w">
            {{ t('tenantguarantorchoice.ask-guarantor') }}
          </div>

          <GuarantorTypeSelector
            :local-storage-key="`cotenantGuarantorType_${tenantId}`"
            :is-cotenant="isCotenant"
            @selected="tmpGuarantorType = $event"
          >
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

      <GuarantorFooter @on-back="goBack" @on-next="setGuarantorType"></GuarantorFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { AnalyticsService } from '../services/AnalyticsService'
import GuarantorFooter from './footer/GuarantorFooter.vue'
import GuarantorTypeSelector from '@/components/GuarantorTypeSelector.vue'
import { ToastService } from '@/services/ToastService'
import { onBeforeMount, onUpdated, ref } from 'vue'
import { useTenantStore } from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'

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
    ToastService.error('tenantguarantorchoice.type-required')
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
          ToastService.error('try-again')
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

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
  line-height: 1.5rem;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: var(--secondary);
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: var(--light-blue-transparent);
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: 100%;
  }
}

.small-font {
  font-size: 14px;
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}
</style>
