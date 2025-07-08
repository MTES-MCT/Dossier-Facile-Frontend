<template>
  <div class="fr-mb-15w">
    <Form @submit="onSubmit">
      <NakedCard class="fr-p-5w">
        <h1>{{ t('nameinformationform.title') }}</h1>
        <p>{{ t('nameinformationform.subtitle') }}</p>
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="lastname"
                >{{ t('nameinformationform.lastname') }} :</label
              >
              <Field
                v-slot="{ field, meta }"
                v-model.trim="lastname"
                name="lastname"
                :rules="{
                  required: true
                }"
              >
                <input
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="t('nameinformationform.lastname')"
                  :disabled="franceConnect"
                  type="text"
                />
              </Field>
              <ErrorMessage v-slot="{ message }" name="lastname">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label for="firstname" class="fr-label"
                >{{ t('nameinformationform.firstname') }} :</label
              >
              <Field
                v-slot="{ field, meta }"
                v-model.trim="firstname"
                name="firstname"
                :rules="{
                  required: true
                }"
              >
                <input
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="t('nameinformationform.firstname')"
                  :disabled="franceConnect"
                  type="text"
                />
              </Field>
              <ErrorMessage v-slot="{ message }" name="firstname">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label for="email" class="fr-label">{{ t('nameinformationform.email') }} :</label>
              <Field
                id="email"
                v-slot="{ field, meta }"
                v-model="email"
                name="email"
                :rules="{
                  email: true,
                  required: true
                }"
              >
                <input
                  v-bind="field"
                  disabled
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="t('nameinformationform.email')"
                  type="email"
                />
              </Field>
              <ErrorMessage v-slot="{ message }" name="email">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter :show-back="false"></ProfileFooter>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import router from '../../router'
import ProfileFooter from '../footer/ProfileFooter.vue'
import useOwnerStore from '../../store/owner-store'
import { isAxiosError } from 'axios'

const { t } = useI18n()
const store = useOwnerStore()
const toast = useToast()

const properties = store.getProperties

const franceConnect = computed(() => store.getUser?.franceConnect)

const firstname = ref(store.getUser?.firstName || '')
const lastname = ref(store.getUser?.lastName || '')
const email = ref(store.getUser?.email || '')

function onSubmit() {
  store
    .saveNames(lastname.value, firstname.value, email.value)
    .then(() => {
      if (properties.length > 0) {
        router.push({ name: 'Dashboard' })
        return
      }
      router.push({ name: 'PropertyName' })
    })
    .catch((err) => {
      if (isAxiosError(err) && err.response?.data.message?.includes('email_exists')) {
        toast.error(t('nameinformationform.email-exists').toString(), {
          timeout: 7000
        })
      }
    })
}
</script>
