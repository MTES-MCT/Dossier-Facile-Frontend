<template>
  <div>
    <div>
      <h1 class="fr-h2 text-center fr-mt-3w fr-mb-3w color--primary">
        {{ t('title') }}
      </h1>

      <template>
        <div class="fr-mt-5w fr-mb-5w">
          <div v-if="getParams() !== undefined">
            <router-link
              :to="{
                name: 'SourceLink',
                params: getParams(),
                query: getQuery()
              }"
              class="color--primary"
              >{{ t('connect-france-connect') }}</router-link
            >
          </div>
          <div v-else>
            <div class="fr-alert fr-alert--info">
              <p class="fr-alert__title">{{ t('alert-info-title') }}</p>
              <p>{{ t('alert-info-content') }}</p>
            </div>
            <div class="text-center">
              <div class="fr-mt-2w fr-mb-2w small-text">
                FranceConnect est la solution proposée par l’État pour sécuriser et simplifier la
                connexion à vos services en ligne
              </div>
            </div>
            <div id="kc-social-providers" class="fr-mt-5w fr-mb-1w text-center">
              <ul>
                <a
                  id="social-franceconnect-particulier"
                  class="inline-block"
                  type="button"
                  :href="getLoginLink()"
                >
                  <span>{{ t('connect-france-particulier') }}</span>
                </a>
              </ul>
            </div>
            <div class="text-center">
              <a
                href="https://app.franceconnect.gouv.fr/en-savoir-plus"
                id="cQuoiFCGauche"
                target="_blank"
                rel="noopener"
              >
                Qu'est-ce que FranceConnect?
              </a>
            </div>
          </div>
        </div>

        <div class="separator">{{ t('or') }}</div>
      </template>

      <Form id="signupForm" name="form" @submit="handleRegister">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <Field
              name="email"
              v-model="user.email"
              v-slot="{ field, meta }"
              :rules="{
                required: true
              }"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="email">{{ t('email') }}</label>
                <input
                  v-bind="field"
                  class="form-control validate-required fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  id="email"
                  name="email"
                  :placeholder="t('email-placeholder')"
                  type="email"
                  autocomplete="email"
                  required
                />
                <ErrorMessage name="email" v-slot="{ message }">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </Field>
          </div>
          <div class="fr-col-12 fr-mb-1w">
            <Field
              name="password"
              v-model="user.password"
              v-slot="{ field, meta }"
              :rules="`required|strength:${score}`"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="password">{{ t('password') }}</label>
                <input
                  id="password"
                  :placeholder="t('example-prefix') + generatedPwd"
                  type="password"
                  v-bind="field"
                  name="password"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  autocomplete="new-password"
                  required
                />
                <PasswordMeter @score="setScore" :password="user.password || ''" />
                <ErrorMessage name="password" v-slot="{ message }">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </Field>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <Field
              name="confirm-password"
              v-model="user.confirm"
              v-slot="{ field, meta }"
              :rules="{
                required: true,
                confirm: [user.password, user.confirm]
              }"
            >
              <div class="fr-input-group">
                <label class="fr-label" for="confirm-password"> {{ t('confirm-password') }}</label>
                <input
                  id="confirm-password"
                  type="password"
                  v-bind="field"
                  name="confirm-password"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  autocomplete="new-password"
                  required
                />
                <ErrorMessage name="confirm-password" v-slot="{ message }">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </Field>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="bg-purple fr-checkbox-group">
              <Field name="acceptCgu" id="acceptCgu" type="checkbox" rules="isTrue" :value="true" />
              <label for="acceptCgu"><div v-html="t('accept-cgu')"></div></label>
              <ErrorMessage class="fr-error-text" name="acceptCgu" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button id="signup-submit" class="fr-btn full-width-btn" type="submit">
              {{ t('submit') }}
            </button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PasswordMeter from 'df-shared-next/src/components/PasswordMeter/PasswordMeter.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { generatePasswordPlaceholder } from '@/services/UtilsService'
const { t } = useI18n()

const PASSWORD_MIN_SCORE = 2
const FRANCE_CONNECT_LOGIN_URL = import.meta.env.VITE_FRANCE_CONNECT_LOGIN_URL

const props = defineProps<{
  email: string
}>()

const user = ref(new User())
const score = ref(0)
const generatedPwd = ref('')
const route = useRoute()
const emit = defineEmits<{ 'on-register': [user: User] }>()

onMounted(() => {
  user.value.email = props.email
  generatedPwd.value = generatePasswordPlaceholder()
})

function handleRegister() {
  if (score.value < PASSWORD_MIN_SCORE) {
    return
  }
  emit('on-register', user.value)
}

function setScore(s: number) {
  score.value = s
}

function getParams() {
  if (!route.params.source) {
    return undefined
  }
  return {
    source: route.params.source
  }
}

function getQuery() {
  return {
    internalPartnerId: route.query.internalPartnerId?.toString() || '',
    firstName: route.query.firstName?.toString() || '',
    lastName: route.query.lastName?.toString() || '',
    email: route.query.email?.toString() || ''
  }
}

function getLoginLink() {
  return FRANCE_CONNECT_LOGIN_URL
}
</script>

<style lang="scss">
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

<i18n>
{
"en": {
"title": "Create account",
"password": "Password :",
"email-placeholder": "E.g.: example{'@'}example.fr",
"confirm-password": "Confirm password :",
"email": "Email :",
"submit": "I create my account",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"password-not-confirmed": "Password not confirmed",
"pwd-not-complex": "Password not secure enough",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a target=\"_blank\" href='https://www.dossierfacile.logement.gouv.fr/cgu'>Conditions générales d’utilisation</a> de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" href='https://dossierfacile.logement.gouv.fr/politique-de-confidentialite'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
"or": "or",
"connect-france-connect": "Connect with FranceConnect",
"alert-info-title": "Connection with FranceConnect",
"alert-info-content": "If you create a DossierFacile for your child, you have to use their FranceConnect account or to create their own account !"
},
"fr": {
"title": "Rejoindre DossierFacile",
"password": "Votre mot de passe :",
"confirm-password": "Confirmation de votre mot de passe :",
"email-placeholder": "Ex : exemple{'@'}exemple.fr",
"email": "Votre e-mail :",
"submit": "Je crée mon compte",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"password-not-confirmed": "Le mot de passe ne correspond pas",
"pwd-not-complex": "Mot de passe trop simple",
"accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a class=\"cgu\" target=\"_blank\" href='https://www.dossierfacile.logement.gouv.fr/cgu'>Conditions générales d’utilisation</a> de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" class=\"cgu\" href='https://www.dossierfacile.logement.gouv.fr/politique-de-confidentialite'>Politique de confidentialité</a> de DossierFacile",
"require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
"or": "Ou",
"connect-france-connect": "Se connecter avec FranceConnect",
"alert-info-title": "Connexion FranceConnect",
"alert-info-content": "Si vous faites un DossierFacile pour le compte de votre enfant, utilisez son compte FranceConnect ou créez un compte à son nom !"
}
}
</i18n>
