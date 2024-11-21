<template>
  <div class="fr-container fr-card card fr-card--shadow fr-mt-2w">
    <div class="fr-my-2w">
      <div class="fr-h5">
        {{ t('register.title-card') }}
        <span class="text--light-blue"> {{ t('register.title-card-1') }}</span>
      </div>
      <div class="bold-title">
        {{ t('register.title-register-with-fc') }}
      </div>
      <div class="small-text">
        {{ t('register.description-france-connect') }}
      </div>
      <div class="kc-social-providers fr-mt-1w fr-mb-1w">
        <div class="fr-connect-group">
          <button class="fr-connect" @click="loginFranceConnect">
            <span class="fr-connect__login">S’identifier avec</span>
            <span class="fr-connect__brand">FranceConnect</span>
          </button>
          <p>
            <a
              href="https://franceconnect.gouv.fr/"
              target="_blank"
              rel="noopener"
              :title="t('register.whatis-france-connect')"
              >{{ t('register.whatis-france-connect') }}</a
            >
          </p>
        </div>
      </div>
      <Form @submit="onSubmit">
        <div>
          <div class="bold-title">
            {{ t('register.title-register-with-email') }}
          </div>
          <div class="fr-mb-1w fr-pr-1w">
            <div class="fr-input-group">
              <label class="fr-label" for="email">{{ t('register.email') }}</label>
              <Field
                id="email"
                name="email"
                v-model="email"
                v-slot="{ field, meta }"
                :rules="{ email: true, required: true }"
              >
                <input
                  v-bind="field"
                  class="form-control validate-required fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="t('register.email-placeholder')"
                  type="email"
                  autocomplete="email"
                />
              </Field>
              <ErrorMessage name="email" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-mb-1w fr-pr-1w">
            <div class="fr-input-group">
              <label class="fr-label" for="password">{{ t('register.password') }}</label>
              <Field
                id="password"
                name="password"
                v-model="password"
                v-slot="{ field, meta }"
                :rules="{ required: true, strength: score }"
              >
                <input
                  v-bind="field"
                  class="form-control validate-required fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  :placeholder="generatedPwd"
                  type="password"
                  autocomplete="new-password"
                />
              </Field>
              <PasswordMeter @score="setScore" :password="password || ''" />
              <ErrorMessage class="error-with-password-meter" name="password" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-mb-1w fr-pr-1w">
            <div class="fr-input-group">
              <label class="fr-label" for="confirm-password">
                {{ t('register.confirm-password-short') }}</label
              >
              <Field
                name="confirm-password"
                v-model="confirm"
                v-slot="{ field, meta }"
                :rules="{
                  required: true,
                  confirm: [password, confirm]
                }"
              >
                <input
                  id="confirm-password"
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  type="password"
                  autocomplete="new-password"
                />
              </Field>
              <ErrorMessage name="confirm-password" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="">
            <div class="fr-input-group">
              <button class="fr-btn full-width" type="submit">
                {{ t('register.submit-short') }}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, Field, ErrorMessage } from 'vee-validate'
import PasswordMeter from 'df-shared-next/src/components/PasswordMeter/PasswordMeter.vue'
import AnalyticsService from '../../services/AnalyticsService'

const { t } = useI18n()

const emit = defineEmits<{
  'on-register': [data: { email: string; password: string }]
  'on-login-franceconnect': []
}>()

const score = ref(0)
const generatedPwd = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')

function generatePlaceholder() {
  const chars = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '#!?-_.'
  ]
  generatedPwd.value =
    t('register.ex') +
    [4, 4, 2, 2]
      .map((len, i) =>
        Array(len)
          .fill(chars[i])
          .map((x) => x[Math.floor(Math.random() * x.length)])
          .join('')
      )
      .concat()
      .join('')
      .split('register.')
      .sort(() => 0.5 - Math.random())
      .join('')
}
function setScore(s: number) {
  score.value = s
}
function onSubmit() {
  if (score.value < 2) {
    return
  }
  AnalyticsService.registerWithTopVerticalForm()
  emit('on-register', { email: email.value, password: password.value })
}
function loginFranceConnect() {
  AnalyticsService.onFranceConnectWithTopVerticalForm()
  emit('on-login-franceconnect')
}

onMounted(() => {
  generatePlaceholder()
})
</script>

<style scoped>
.fr-label {
  font-size: 0.8rem;
}
.fr-input-group .fr-btn {
  margin-top: 0.5rem;
}
.small-text {
  font-size: 0.7rem;
  line-height: 1.25rem;
}
.fr-card {
  border-radius: 4px;
}
.bold-title {
  font-size: 0.8rem;
  font-weight: bold;
}
</style>
