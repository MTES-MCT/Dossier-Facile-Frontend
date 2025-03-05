<template>
  <div class="bg-blue">
    <div class="fr-container">
      <section class="fr-my-5w">
        <h1 class="fr-h4">{{ t('sharing-page.title') }}</h1>
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
          <NakedCard class="fr-px-md-3w fr-py-md-4w" v-if="displayShareBloc()">
            <ShareFile></ShareFile>
          </NakedCard>
          <div class="fr-alert fr-alert--warning fr-mb-0" v-else>
            <h3 class="fr-h5">
              {{
                t(`sharing-page.file-not-ready.title`, [
                  t(`sharing-page.file-not-ready.status.${fileStatus}`)
                ])
              }}
            </h3>
            <p>{{ t('sharing-page.file-not-ready.explanation') }}</p>
          </div>
          <SharedLinks></SharedLinks>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import ShareFile from '@/components/account/ShareFile.vue'
import SharedLinks from '@/components/SharedLinks.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import { UtilsService } from '@/services/UtilsService'
import { useI18n } from 'vue-i18n'

const store = useTenantStore()
const user = computed(() => {
  return store.user
})
const { t } = useI18n()

onBeforeMount(() => {
  store.loadApartmentSharingLinks()
})

const fileStatus = computed(() => {
  return user.value.status || ''
})

function displayShareBloc() {
  return UtilsService.canShareFile(user.value)
}
</script>

<style scoped lang="scss"></style>
