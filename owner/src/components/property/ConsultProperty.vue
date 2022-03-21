<template>
  <div>
    <h1>{{ t("title") }}</h1>
    <div>{{ token }}</div>
    {{p}}
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const { t } = useI18n();

defineProps<{}>();

const route = useRoute();
const store = useStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.dispatch('updatePropertyToConsult', id.value);
}

const token = computed(() => store.getters.getPropertyToConsult?.token);
const p = store.getters.getPropertyToConsult;
</script>

<i18n>
{
  "en": {
    "title": "consult"
  },
  "fr": {
    "title": "Consultation"
  }
}
</i18n>
