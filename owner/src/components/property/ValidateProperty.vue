<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Field, ErrorMessage } from 'vee-validate'
import { useToast } from 'vue-toastification'
import PropertyPage from './PropertyPage.vue'
import useOwnerStore from '../../store/owner-store'
import UpdateRowBtn from './UpdateRowBtn.vue'
import { SharedPropertyService } from 'df-shared-next/src/services/SharedPropertyService'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const store = useOwnerStore()
const authorize = ref(false)
const toast = useToast()

const id = ref(0)
if (route.params.id) {
  id.value = Number(route.params.id)
  store.updatePropertyToEdit(Number(id.value))
  authorize.value = store.getPropertyToEdit.validated
}

const getParams = id.value > 0 ? { id: id.value } : {}

const property = store.getPropertyToEdit

const hasErrors = computed(
  () =>
    !(
      property.name &&
      property.address &&
      property.furniture &&
      property.livingSpace &&
      property.livingSpace > 0 &&
      property.rentCost &&
      property.rentCost > 0 &&
      property.chargesCost !== undefined &&
      property.chargesCost >= 0 &&
      SharedPropertyService.hasDpe(property)
    )
)

async function onSubmit() {
  if (hasErrors.value) {
    toast.error(t('validateproperty.try-again').toString(), {
      timeout: 7000
    })
    return
  }
  await store.setPropertyValidated(true)
  store.saveProperty().then(() => {
    router.push({ name: 'Dashboard' })
  })
}

function onBack() {
  router.push({
    name: 'PropertyDiagnostic',
    params: { id: store.getPropertyToEdit.id }
  })
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h4">{{ t('validateproperty.validate-title') }}</h1>
      <div v-if="!hasErrors">
        <p>{{ t('validateproperty.validate-subtitle') }}</p>
        <div class="bg-purple fr-checkbox-group">
          <Field
            id="authorize"
            v-model="authorize"
            name="authorize"
            type="checkbox"
            rules="isTrue"
            :value="true"
          />
          <label for="authorize"><div v-html="t('validateproperty.authorize')"></div></label>
          <ErrorMessage v-slot="{ message }" class="fr-error-text" name="authorize">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>
      <div v-else>
        <h6 class="color--red">{{ t('validateproperty.error-title') }}</h6>
        <p>
          {{ t('validateproperty.property-not-valid') }}
        </p>
        <div v-if="!property.name">
          <UpdateRowBtn
            :title="t('validateproperty.property-name')"
            :to="{ name: 'PropertyName', params: getParams }"
          ></UpdateRowBtn>
        </div>
        <div v-if="!property.type">
          <UpdateRowBtn
            :title="t('validateproperty.property-type')"
            :to="{ name: 'PropertyType', params: getParams }"
          ></UpdateRowBtn>
        </div>
        <div v-if="!property.furniture">
          <UpdateRowBtn
            :title="t('validateproperty.property-furniture')"
            :to="{ name: 'PropertyFurniture', params: getParams }"
          ></UpdateRowBtn>
        </div>
        <div v-if="!property.address">
          <UpdateRowBtn
            :title="t('validateproperty.property-address')"
            :to="{ name: 'PropertyAddress', params: getParams }"
          ></UpdateRowBtn>
        </div>
        <div v-if="!property.livingSpace || property.livingSpace <= 0">
          <UpdateRowBtn
            :title="t('property-living-space')"
            :to="{ name: 'PropertyLivingSpace', params: getParams }"
          ></UpdateRowBtn>
        </div>
        <div
          v-if="
            !property.rentCost ||
            property.rentCost <= 0 ||
            property.chargesCost === undefined ||
            property.chargesCost < 0
          "
        >
          <UpdateRowBtn
            :title="t('validateproperty.property-rent')"
            :to="{ name: 'PropertyRent', params: getParams }"
          ></UpdateRowBtn>
        </div>
        <div
          v-if="
            !property.energyConsumption ||
            property.energyConsumption <= 0 ||
            property.co2Emission === undefined ||
            property.co2Emission < 0
          "
        >
          <UpdateRowBtn
            :title="t('validateproperty.property-dpe')"
            :to="{ name: 'PropertyDiagnostic', params: getParams }"
          ></UpdateRowBtn>
        </div>
      </div>
    </NakedCard>
  </PropertyPage>
</template>
