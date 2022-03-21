<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { useStore } from 'vuex';
import { computed } from 'vue';

const { t } = useI18n();
const store = useStore();

function getName() {
  return `${store.getters.getUser?.lastName} ${store.getters.getUser?.firstName}`;
}

const propertyName = computed(() => store.getters.getPropertyToEdit?.name);
</script>

<template>
  <div class="left-edit-menu">
    <div class="inner-left-edit fr-pt-7w fr-pt-7w">
      <div class="active step">
        <div class="step-number">1</div>
        <div class="step-title">
          <router-link :to="{ name: 'AccountName' }" class="fr-link">
            {{ t("personal-information") }}</router-link
          >
        </div>
      </div>
      <div class="vline">
        <div class="ml-5"><ColoredTag
              :text="getName()"
              status="NAME"
            ></ColoredTag
          >
        </div>
      </div>
      <div class="active step">
        <div class="step-number">2</div>
        <div class="step-title">
          <router-link :to="{ name: 'AccountName' }" class="fr-link">
            {{ t("add-property") }}</router-link
          >
        </div>
      </div>
      <div class="vline">
        <div class="ml-5">
          {{ propertyName }}
        </div>
        <div class="ml-5">
          {{ t('monthly-rent-and-charges')}}
        </div>
      </div>
      <div class="active step">
        <div class="step-number">3</div>
        <div class="step-title">
          <router-link :to="{ name: 'AccountName' }" class="fr-link">
            {{ t("validate-property") }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-edit-menu {
  background-color: var(--background-default-grey);
  @media all and (max-width: 768px) {
    display: none;
  }
}

.inner-left-edit {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}

.vline {
  margin-left: 23px;
  border-left: 1px solid var(--g400-t);
  z-index: 0;
  min-height: 25px;
  &.active {
    border-left: 1px solid var(--primary);
  }
}

.step {
  display: flex;
  align-items: center;
  height: 3rem;
}

.step-number {
  background-color: white;
  border: 1px solid var(--g400-t);
  margin: 0 5px;
  border-radius: 50%;
  height: 2.25rem;
  width: 2.25rem;
  min-width: 2.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active .step-number {
  background-color: var(--primary);
  color: white;
}

.step-title {
  padding: 5px 5px 0;
}

</style>

<i18n>
{
  "en": {
    "personal-information": "My personal data",
    "add-property": "I add my property",
    "validate-property": "I validate my property",
    "monthly-rent-and-charges": "Monthly rent and charges"
  },
  "fr": {
    "personal-information": "Mes informations personnelles",
    "add-property": "J'ajoute un bien",
    "validate-property": "Je valide ma propriété",
    "monthly-rent-and-charges": "Loyer et charges mensuels"
  }
}
</i18n>
