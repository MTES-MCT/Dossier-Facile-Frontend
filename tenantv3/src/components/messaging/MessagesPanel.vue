<template>
  <div>
    <ColoredTag :text="t('DECLINED')" status="DECLINED" />
    <h2 class="fr-mt-1w">{{ t('overview') }}</h2>
    <DeclinedDocuments :tenant="tenant" :is-cotenant="isCotenant" />

    <h2 class="fr-mt-3w">{{ t('menu.messaging') }}</h2>
    <div class="conversation__reply boxed boxed--border fr-p-3w">
      <div class="messages fr-mb-3w">
        <template v-for="m in tenantMessages" :key="m.id">
          <div class="separator">
            <span class="date">{{ formatDate(m.creationDateTime) }}</span>
          </div>
          <div
            class="message"
            :class="{
              tenant: m.typeMessage === 'FROM_TENANT',
              operator: m.typeMessage === 'TO_TENANT'
            }"
            v-html="m.messageBody"
          ></div>
        </template>
      </div>

      <form name="form" @submit.prevent="handleSubmit">
        <h3 class="answer-title">Répondre dans la messagerie</h3>
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

          <p class="advice">
            Le temps de traitement d'un message est le même que celui d'un dossier. Nous vous
            recommandons donc de ne pas envoyer de message sans modifier vos documents pour ne pas
            perdre de temps.
          </p>
          <div class="fr-col-12 fr-mb-5w">
            <button class="fr-btn" type="submit" :disabled="!sendMessage">
              Envoyer votre message
            </button>
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
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import dayjs from 'dayjs'
dayjs.extend(isToday)
dayjs.extend(isYesterday)

const { t } = useI18n()
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

const formatDate = (time: Date | undefined) => {
  const date = dayjs(time)
  if (date.isToday()) {
    return date.format("[Aujourd'hui à] HH[h]mm")
  }
  if (date.isYesterday()) {
    return date.format('[Hier à] HH[h]mm')
  }
  return date.format('Le D MMMM YYYY à HH[h]mm')
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
  background-color: var(--background-alt-grey);
  border-radius: 1rem;
}

.tenant {
  max-width: 90%;
  margin-left: auto;
}

.operator {
  max-width: 90%;
}

.separator {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ddd;
  position: relative;
  height: 1rem;
  & > .date {
    font-size: 0.875rem;
    background-color: white;
    position: absolute;
    padding-inline: 0.5rem;
    top: -0.25rem;
  }
}

.answer-title {
  font-size: 1.25rem;
}

#sendMessage {
  background-color: var(--background-alt-grey);
  border: 1px solid #929292;
  border-radius: 0;
  box-shadow: none;
}

.advice {
  font-style: italic;
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
