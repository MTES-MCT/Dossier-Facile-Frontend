<template>
  <div class="fr-container fr-container--fluid fluid-full-width">
    <div class="fr-grid-row">
      <div class="fr-col-lg-9 fr-col-12">
        <Form @submit="onSubmit">
          <div class="fr-container">
            <div class="fr-grid-row">
              <div class="fr-col-12 fr-h5">
                {{ t('register.title-card') }}
                <span class="text--light-blue"> {{ t('register.title-card-1') }}</span>
              </div>
            </div>
            <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-lg-3 fr-mb-1w fr-pr-1w">
                <div class="fr-input-group">
                  <label class="fr-label" for="email">{{ t('register.email') }}</label>
                  <Field
                    id="email"
                    v-slot="{ field, meta }"
                    v-model="email"
                    name="email"
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
                  <ErrorMessage v-slot="{ message }" name="email">
                    <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                  </ErrorMessage>
                </div>
              </div>
              <div class="fr-col-12 fr-col-lg-3 fr-mb-1w fr-pr-1w">
                <div class="fr-input-group">
                  <label class="fr-label" for="password">{{ t('register.password') }}</label>
                  <Field
                    id="password"
                    v-slot="{ field, meta }"
                    v-model="password"
                    name="password"
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
                  <PasswordMeter :password="password || ''" @score="setScore" />
                  <ErrorMessage v-slot="{ message }" name="password">
                    <span role="alert" class="fr-error-text with-password-meter">{{
                      t(message || '')
                    }}</span>
                  </ErrorMessage>
                </div>
              </div>
              <div class="fr-col-12 fr-col-lg-3 fr-mb-1w fr-pr-1w">
                <div class="fr-input-group">
                  <label class="fr-label" for="confirm-password">
                    {{ t('register.confirm-password-short') }}</label
                  >
                  <Field
                    v-slot="{ field, meta }"
                    v-model="confirm"
                    name="confirm-password"
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
                  <ErrorMessage v-slot="{ message }" name="confirm-password">
                    <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                  </ErrorMessage>
                </div>
              </div>
              <div class="fr-col-12 fr-col-lg-3">
                <div class="fr-input-group">
                  <label class="fr-label">&nbsp;</label>
                  <button class="fr-btn full-width-btn" type="submit">
                    {{ t('register.submit-short') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>

      <div class="fr-col-lg-3 fr-col-12 fr-grid-row">
        <div class="fr-col-12 fr-col-lg-2 ou">
          {{ t('register.or-small-caps') }}
        </div>
        <div class="fr-col-12 fr-col-lg-10">
          <div class="small-text">
            {{ t('register.description-france-connect') }}
          </div>
          <div class="kc-social-providers fr-mt-1w fr-mb-1w">
            <div class="fr-connect-group">
              <button class="fr-connect" @click="loginFranceConnect()">
                <span class="fr-connect__login">S’identifier avec</span>
                <span class="fr-connect__brand">FranceConnect</span>
              </button>
              <p>
                <a
                  href="https://franceconnect.gouv.fr/"
                  target="_blank"
                  rel="noopener"
                  :title="`${t('register.whatis-france-connect')} - ${t('new-window')}`"
                  >{{ t('register.whatis-france-connect') }}</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
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
  AnalyticsService.registerWithBottomInlineForm()
  emit('on-register', { email: email.value, password: password.value })
}
function loginFranceConnect() {
  AnalyticsService.onFranceConnectWithBottomInlineForm()
  emit('on-login-franceconnect')
}

onMounted(() => {
  generatePlaceholder()
})
</script>

<style scoped>
.df-image-background {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url('../assets/cover-features.webp');
  background-color: #6277a0;
  @media (max-width: 768px) {
    background-image: url('../assets/cover-features-mobile.webp');
  }

  z-index: 0;
}
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
.with-password-meter {
  margin-top: 0.2rem;
}
.ou {
  margin: auto;
}
</style>
