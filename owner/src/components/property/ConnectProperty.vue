<template>
  <PropertyContainer v-if="!propertyNotFound">
    <div class="fr-grid-row fr-mt-3w fr-grid-row--gutters stretch">
      <div class="fr-col-12 fr-col-md-7">
        <NakedCard class="bg-purple-var fr-p-5w h-100">
          <Form class="h-100 fr-grid-col" @submit="onSubmit">
            <h2 class="fr-h4">
              {{ t('connectproperty.apply-existing-account') }}
            </h2>
            <div>{{ t('connectproperty.apply-existing-text') }}</div>

            <div class="bg-purple fr-checkbox-group">
              <Field
                id="authorize"
                v-model="authorize"
                name="authorize"
                type="checkbox"
                rules="isTrue"
                :value="true"
              />
              <label for="authorize"
                ><div>
                  {{ t('connectproperty.authorize', [p.ownerName, p.address]) }}
                </div></label
              >
              <ErrorMessage v-slot="{ message }" class="fr-error-text" name="authorize">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
            <div class="mt-auto align-end">
              <DfButton type="submit" :title="t('connectproperty.create-account')" :primary="true">
                {{ t('connectproperty.connect') }}
              </DfButton>
            </div>
          </Form>
        </NakedCard>
      </div>
      <div class="fr-col-12 fr-col-md-5">
        <NakedCard class="fr-p-5w h-100 fr-grid-col">
          <h2 class="fr-h4">{{ t('connectproperty.apply-new-account') }}</h2>
          <p>
            {{ t('connectproperty.apply-new-text-1') }}
          </p>
          <p>
            {{ t('connectproperty.apply-new-text-2') }}
          </p>
          <div class="align-end mt-auto">
            <a :href="`${TENANT_URL}/signup`" class="fr-btn fr-mt-3w">{{
              t('connectproperty.create-account')
            }}</a>
          </div>
        </NakedCard>
      </div>
    </div>
  </PropertyContainer>
  <div v-if="propertyNotFound" class="not-found-container fr-mt-5w">
    <div>
      <NakedCard class="fr-p-5w">
        {{ t('connectproperty.not-found') }}
      </NakedCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import useOwnerStore from '../../store/owner-store'
import PropertyContainer from './PropertyContainer.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useOwnerStore()

const token = ref('')
const authorize = ref(false)
const propertyNotFound = ref(true)

onMounted(() => {
  if (route.params.token) {
    token.value = route.params.token.toString()
    store.setPropertyToConsult(token.value)
    propertyNotFound.value = false
  } else {
    router.push({ name: 'Dashboard' })
  }
})

const TENANT_URL = `${import.meta.env.VITE_FULL_TENANT_URL}`
const p = computed(() => store.getPropertyToConsult)

function onSubmit() {
  window.location.replace(`/validConnexion/${token.value}`)
}
</script>

<style scoped lang="scss">
.h-100 {
  height: 100%;
}

.stretch {
  justify-content: stretch;
}

.align-end {
  text-align: end;
}

.mt-auto {
  margin-top: auto;
}

.not-found-container {
  width: 100vw;
  display: flex;
  justify-content: center;
}
</style>
