<template>
  <div>
    <div>
      <h2 class="fr-h2 text-center fr-mt-3w fr-mb-5w color--primary">
        {{ t('register.title') }}
      </h2>

      <template v-if="franceConnect">
        <div class="fr-mt-5w fr-mb-5w text-center">
          <div>
            <div class="text-center">
              <div class="fr-mt-2w fr-mb-2w small-text">
                FranceConnect est la solution proposée par l’État pour sécuriser et simplifier la
                connexion à vos services en ligne
              </div>
            </div>
            <div id="kc-social-providers" class="fr-mt-5w fr-mb-1w">
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
                    :title="t('register.whatis-france-connect')"
                    >{{ t('register.whatis-france-connect') }}</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="separator">{{ t('register.or') }}</div>
      </template>

      <Form @submit="onSubmit">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
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
          <div class="fr-col-12 fr-mb-1w">
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
              <ErrorMessage name="password" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="confirm-password">
                {{ t('register.confirm-password') }}</label
              >
              <Field
                id="confirm-password"
                name="confirm-password"
                v-model="confirm"
                v-slot="{ field, meta }"
                :rules="{
                  required: true,
                  confirm: [password, confirm]
                }"
              >
                <input
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

          <div class="fr-col-12 fr-mb-3w">
            <div class="bg-purple fr-checkbox-group">
              <Field name="terms" id="terms" type="checkbox" rules="isTrue" :value="true" />
              <label for="terms"><div v-html="t('register.accept-cgu')"></div></label>
              <ErrorMessage class="fr-error-text" name="terms" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button class="fr-btn full-width-btn" type="submit">
              {{ t('register.submit') }}
            </button>
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

const FRANCE_CONNECT_LOGIN_URL = import.meta.env.VUE_APP_FRANCE_CONNECT_LOGIN_URL

const { t } = useI18n()

const emit = defineEmits<{ 'on-register': [data: { email: string; password: string }] }>()
const franceConnect =
  window.location.href.includes('locataire-dev') || window.location.href.includes('localhost')

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

function loginFranceConnect() {
  if (FRANCE_CONNECT_LOGIN_URL) {
    window.location.href = FRANCE_CONNECT_LOGIN_URL.toString()
  }
}

onMounted(() => {
  generatePlaceholder()
})

function onSubmit() {
  emit('on-register', { email: email.value, password: password.value })
}

function setScore(s: number) {
  score.value = s
}
</script>

<style lang="scss">
.fr-connect {
  display: inline-flex;
}
.full-width-btn {
  width: 100%;
  display: table-cell;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6a6a6a;
  font-size: 12px;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #cecece;
}

.separator:not(:empty)::before {
  margin-right: 2rem;
}

.separator:not(:empty)::after {
  margin-left: 2rem;
}

a.zocial.franceconnect-particulier {
  background: url(../assets/fc/franceconnect-bouton@2x.png) no-repeat left top;
  height: 70px;
  width: auto;
  padding-top: 60px;
}

a.zocial.franceconnect-particulier:hover {
  background: url(../assets/fc/franceconnect-bouton-hover@2x.png) no-repeat left top !important;
  height: 70px;
  width: auto;
}

a.zocial.franceconnect-particulier span {
  display: none;
}

a#social-franceconnect-particulier {
  background: url(../assets/fc/franceconnect-bouton.png) no-repeat left top;
  height: 60px;
  width: 230px;
}

a#social-franceconnect-particulier:hover {
  background: url(../assets/fc/franceconnect-bouton-hover.png) no-repeat left top !important;
  height: 60px;
  width: 230px;
}

a#social-franceconnect-particulier span {
  display: none;
}

.inline-block {
  display: inline-block;
}
</style>
