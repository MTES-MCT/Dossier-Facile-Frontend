<template>
  <div>
    <ColoredTag :text="t('DECLINED')" status="DECLINED" />
    <h2 class="fr-mt-1w">{{ t('overview') }}</h2>
    <DeclinedDocuments :tenant="tenant" :is-cotenant="isCotenant" />

    <h2 class="fr-mt-3w">{{ t('menu.messaging') }}</h2>
    <div class="conversation__reply boxed boxed--border fr-p-3w">
      <div class="messages fr-mb-3w">
        <div
          v-for="m in tenantMessages"
          :key="m.id"
          class="message"
          :class="{
            tenant: m.typeMessage === 'FROM_TENANT',
            operator: m.typeMessage === 'TO_TENANT'
          }"
        >
          <p v-html="m.messageBody"></p>
          <div class="date">
            {{ d(new Date(m.creationDateTime || Date.now()), 'long') }}
          </div>
        </div>
      </div>

      <form name="form" @submit.prevent="handleSubmit">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <textarea
                v-model="sendMessage"
                class="form-control fr-input"
                autocomplete="off"
                autofocus
                id="sendMessage"
                placeholder="Tapez votre message ici"
                rows="4"
                name="sendMessage"
                type="text"
              />
            </div>
          </div>

          <div class="fr-col-12 fr-mb-5w">
            <button class="fr-btn" type="submit" :disabled="!sendMessage">Répondre</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import useTenantStore from '@/stores/tenant-store'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DeclinedDocuments from './DeclinedDocuments.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'

const { t, d } = useI18n()
const store = useTenantStore()
const messageList = computed(() => store.messageList)

const sendMessage = ref('')
const tenantMessages = computed(() => messageList.value[props.tenant.id])

const props = withDefaults(
  defineProps<{
    tenant: CoTenant
    isCotenant?: boolean
  }>(),
  {
    isCotenant: false
  }
)

function handleSubmit() {
  store.sendMessage(sendMessage.value, props.tenant.id).then(() => {
    sendMessage.value = ''
  })
}
</script>

<style lang="scss" scoped>
.messages {
  max-height: 80vh;
  overflow-y: auto;
}

.message {
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: var(--g300);
  border-radius: 1rem;
}

.date {
  text-align: right;
  color: var(--g600);
  font-size: 0.8rem;
}

.tenant {
  max-width: 90%;
  margin-left: auto;
  background-color: var(--g200);
}

.operator {
  max-width: 90%;
}
</style>

<i18n>
{
  "fr": {
    "overview": "Aperçu des documents refusés"
  },
  "en": {

    "overview": "Overview of rejected documents"
  }
}
</i18n>
