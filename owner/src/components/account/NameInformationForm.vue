<template>
  <div class="fr-mb-15w">
    <Form @submit="onSubmit">
      <NakedCard class="fr-p-5w">
        <h1>{{ t("title") }}</h1>
        <p>{{ t("subtitle") }}</p>
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="lastname">{{ t("lastname") }} :</label>
              <Field
                id="lastname"
                name="lastname"
                v-model="lastname"
                v-slot="{ field, meta }"
                :rules="{
                  required: true,
                }"
              >
                <input
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid,
                  }"
                  :placeholder="t('lastname')"
                  :disabled="franceConnect"
                  type="text"
                />
              </Field>
              <ErrorMessage name="lastname" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label for="firstname" class="fr-label">{{ t("firstname") }} :</label>
              <Field
                id="firstname"
                name="firstname"
                v-model="firstname"
                v-slot="{ field, meta }"
                :rules="{
                  required: true,
                }"
              >
                <input
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid,
                  }"
                  :placeholder="t('firstname')"
                  :disabled="franceConnect"
                  type="text"
                />
              </Field>
              <ErrorMessage name="firstname" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label for="email" class="fr-label">{{ t("email") }} :</label>
              <Field
                id="email"
                name="email"
                v-model="email"
                v-slot="{ field, meta }"
                :rules="{
                  email: true,
                  required: true,
                }"
              >
                <input
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid,
                  }"
                  :placeholder="t('email')"
                  :disabled="franceConnect"
                  type="email"
                />
              </Field>
              <ErrorMessage name="email" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter :showBack="false"></ProfileFooter>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import {
  Form, Field, ErrorMessage, useField,
} from 'vee-validate';
import NakedCard from 'df-shared/src/components/NakedCard.vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '../../router';
import ProfileFooter from '../footer/ProfileFooter.vue';
import useOwnerStore from '../../store/owner-store';

const { t } = useI18n();
const store = useOwnerStore();

const properties = store.getProperties;

const franceConnect = computed(() => store.getUser?.franceConnect);

const firstname = ref(store.getUser?.firstName || '');
const lastname = ref(store.getUser?.lastName || '');
const email = ref(store.getUser?.email || '');

function onSubmit() {
  store.saveNames(lastname.value, firstname.value, email.value).then(() => {
    if (properties.length > 0) {
      router.push({ name: 'Dashboard' });
      return;
    }
    router.push({ name: 'PropertyName' });
  });
}
</script>

<i18n>
{
  "en": {
    "title": "I enter my personal information",
    "subtitle": "Please fill in the information of the person whose name will appear on the rental lease",
    "lastname": "Lastname",
    "firstname": "Firstname",
    "email": "Your email",
    "field-required": "This field is required",
  },
  "fr": {
    "title": "Je renseigne mes informations personnelles",
    "subtitle": "Veuillez renseigner les informations de la personne dont le nom figurera sur le bail de location",
    "lastname": "Nom",
    "firstname": "Prénom",
    "email": "Votre email",
    "field-required": "Ce champ est requis",
  }
}
</i18n>
