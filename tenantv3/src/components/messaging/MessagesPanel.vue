<template>
  <div class="fr-grid-col">
    <ColoredTag :text="t('DECLINED')" status="DECLINED" />
    <h2 class="fr-mt-1w">{{ t('overview') }}</h2>
    <DeclinedDocuments :tenant="tenant" :is-cotenant="isCotenant" />

    <h2 class="fr-mt-3w">{{ t('menu.messaging') }}</h2>
    <div class="messages">
      <template v-for="m in tenantMessages" :key="m.id">
        <div class="separator">
          <span class="date">{{ formatDate(m.creationDateTime) }}</span>
        </div>
        <div
          class="msg-wrapper"
          :class="{
            tenant: m.typeMessage === 'FROM_TENANT',
            operator: m.typeMessage === 'TO_TENANT'
          }"
        >
          <div class="message" v-html="m.messageBody" />
          <div v-if="m.typeMessage === 'FROM_TENANT'" class="avatar tenant">
            <RiUserFill size="46" color="#000091" />
            <span>{{ t('you') }}</span>
          </div>
          <div v-else-if="m.typeMessage === 'TO_TENANT'" class="avatar operator">
            <RiGroupFill size="46" color="#000091" />
            <span>{{ t('team-df') }}</span>
          </div>
        </div>
      </template>
    </div>

    <hr class="fr-mb-3w" />

    <form class="submit-form" name="form" @submit.prevent="handleSubmit">
      <h3 class="answer-title">Répondre dans la messagerie</h3>
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-mb-3w">
          <textarea
            v-model="sendMessage"
            class="sendMessage form-control fr-input"
            autocomplete="off"
            autofocus
            placeholder="Tapez votre message ici"
            rows="4"
            name="sendMessage"
            type="text"
          />
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
  <!-- </div> -->
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
import { RiGroupFill, RiUserFill } from '@remixicon/vue'
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
.message {
  padding: 1.5rem;
  margin-top: 1rem;
  background-color: var(--background-alt-grey);
  flex-grow: 1;
  max-width: 50rem;
  position: relative;
}

.avatar {
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 6rem;
  text-align: center;
}

.avatar.tenant {
  align-self: flex-end;
  width: 5rem;
}

.msg-wrapper {
  margin-bottom: 4rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.message::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  background-color: var(--background-alt-grey);
}

.tenant > .message::before {
  right: 64px;
  bottom: -15px;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.operator > .message::before {
  left: 64px;
  bottom: -15px;
  clip-path: polygon(0 0, 0 100%, 100% 0);
}

@media (min-width: 48rem) {
  .avatar {
    align-self: flex-end;
  }
  .msg-wrapper {
    flex-direction: row;
  }
  .msg-wrapper.operator {
    flex-direction: row-reverse;
  }
  .tenant > .message {
    &::before {
      right: -15px;
      bottom: 24px;
      clip-path: polygon(0 0, 0 100%, 100% 0);
    }
  }
  .operator > .message {
    &::before {
      left: -15px;
      bottom: 24px;
      clip-path: polygon(0 0, 100% 0, 100% 100%);
    }
  }
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

.submit-form {
  align-self: center;
  max-width: 800px;
}

.sendMessage {
  background-color: var(--background-alt-grey);
  border: 1px solid #929292;
  border-radius: 0;
  box-shadow: none;
}

.advice {
  font-style: italic;
}

:deep(.custom-message) {
  list-style-type: none;
  padding: 0;
  margin: -1.5rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & > li:first-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    > p {
      margin: 0;
    }
    > .doc-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
  & > li {
    background-color: var(--background-alt-grey);
    padding: 1.5rem;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 64px;
      bottom: -15px;
      height: 16px;
      width: 16px;
      clip-path: polygon(0 0, 0 100%, 100% 0);
      background-color: var(--background-alt-grey);
    }
    @media (min-width: 48rem) {
      &::before {
        left: -15px;
        bottom: 24px;
        clip-path: polygon(0 0, 100% 0, 100% 100%);
      }
    }
  }
  .name {
    font-size: 1.25rem;
  }
  hr {
    margin-block: 24px;
    padding: 1px;
  }
  ul > li:only-of-type {
    list-style-type: none;
    margin-left: -1rem;
  }
}
</style>

<i18n>
{
  "fr": {
    "overview": "Aperçu des documents refusés",
    "team-df": "Équipe DossierFacile",
    "you": "Vous"
  },
  "en": {
    "overview": "Overview of rejected documents",
    "team-df": "Team DossierFacile",
    "you": "You"
  }
}
</i18n>
