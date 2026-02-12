<template>
  <ProfileContainer :step="getStep()">
    <ValidateFile @on-back="goBack"></ValidateFile>
    <div class="contact-support-container">
      <RiQuestionFill class="icon" aria-hidden="true" />
      <a
        class="contact-link"
        href="/contact"
        target="_blank"
        rel="noopener noreferrer"
        :title="`${t('trigram.support-link')} - ${t('new-window')}`"
      >
        {{ t('trigram.support-link') }}
      </a>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ValidateFile from '../components/ValidateFile.vue'
import ProfileContainer from '../components/ProfileContainer.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RiQuestionFill } from '@remixicon/vue'

const store = useTenantStore()
const user = computed(() => store.user)
const coTenants = computed(() => store.coTenants)

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

function getStep() {
  return Number(route.params.step) || 4
}
function getLastCoTenantId() {
  return coTenants.value[Number(coTenants.value.length) - 1].id
}
function goBack() {
  if (getStep() == 6) {
    router.push({
      name: 'TenantGuarantors',
      params: {
        tenantId: getLastCoTenantId().toString(),
        step: (getStep() - 1).toString()
      }
    })
  } else {
    if (user.value.guarantors === undefined || user.value.guarantors.length === 0) {
      router.push({ name: 'GuarantorChoice' })
      return
    }
    router.push({
      name: 'GuarantorList'
    })
    return
  }
}
</script>

<style lang="scss" scoped>
.contact-support-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
}

.icon {
  color: var(--primary);
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}

.contact-link {
  color: var(--primary);
  font-size: 1rem;
}
</style>
