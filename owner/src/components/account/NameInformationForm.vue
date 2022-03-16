<template>
  <div class="fr-mb-15w">
    <Form @submit.prevent="onSubmit">
        <NakedCard class="fr-p-5w">
          <h1>{{ t("title") }}</h1>
          <p>{{ t("subtitle") }}</p>
          <div class="fr-grid-row fr-grid-row--center">
            <div class="fr-col-12 fr-mb-3w">
                <div
                  class="fr-input-group"
                >
                  <label class="fr-label" for="lastname"
                    >{{ t("lastname") }} :</label
                  >
                  <input
                    v-model="lastName"
                    class="form-control fr-input validate-required"
                    id="lastname"
                    name="lastname"
                    :placeholder="t('lastname')"
                    :disabled="franceConnect"
                    type="text"
                    required
                  />
                </div>
            </div>
            <div class="fr-col-12 fr-mb-3w">
                <div
                  class="fr-input-group"
                >
                  <label for="firstname" class="fr-label"
                    >{{ t("firstname") }} :</label
                  >
                  <input
                    id="firstname"
                    :placeholder="t('firstname')"
                    type="text"
                    v-model="firstName"
                    name="firstname"
                    class="validate-required form-control fr-input"
                    :disabled="franceConnect"
                    required
                  />
              </div>
            </div>
            <div class="fr-col-12 fr-mb-3w">
                <div
                  class="fr-input-group"
                >
                  <label for="email" class="fr-label"
                    >{{ t("email") }} :</label
                  >
                  <input
                    id="email"
                    :placeholder="t('email')"
                    type="email"
                    v-model="email"
                    name="email"
                    class="validate-required form-control fr-input"
                  />
                </div>
            </div>
          </div>
        </NakedCard>
        <ProfileFooter :showBack="false"></ProfileFooter>
      </Form>
  </div>
</template>

<script lang="ts" setup>
import NakedCard from 'df-shared/src/components/NakedCard.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import router from '../../router';
import ProfileFooter from '../footer/ProfileFooter.vue';

const { t } = useI18n();
const store = useStore();

const properties = store.getters.getProperties;

const franceConnect = computed(() => store.getters.getUser?.franceConnect);

const firstName = computed({
  get() {
    return store.getters.getUser?.firstName;
  },
  set(val) {
    store.dispatch('setFirstName', val);
  },
});

const lastName = computed({
  get() {
    return store.getters.getUser?.lastName;
  },
  set(val) {
    store.dispatch('setLastName', val);
  },
});

const email = computed({
  get() {
    return store.getters.getUser?.email;
  },
  set(val) {
    store.dispatch('setEmail', val);
  },
});

function onSubmit() {
  store.dispatch('saveNames', { lastName: lastName.value, firstName: firstName.value, email: email.value }).then(() => {
    if (properties.length > 0) {
      router.push({ name: 'Dashboard' });
    }
    router.push({ name: 'PropertyName' });
  });
}

</script>

<i18n>
{
  "en": {
    "title": "I enter my personal information",
    "subtitle": "Please fill in the information of the person whose name will appear on the rental lease"
  },
  "fr": {
    "title": "Je renseigne mes informations personnelles",
    "subtitle": "Veuillez renseigner les informations de la personne dont le nom figurera sur le bail de location"
  }
}
</i18n>
