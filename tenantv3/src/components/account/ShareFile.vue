<template>
  <div>
    <h2 class="fr-h4 align-items--center" style="display: flex">
      {{ t('sharefile.title') }}
    </h2>
    <p>
      <span v-html="t('sharefile.desc1')"></span>
      <br />
      <span v-html="t('sharefile.desc2', [getUrl()])"></span>
      <br />
      <span class="bold">
        {{ t('sharefile.desc3') }}
      </span>
    </p>
    <Form name="form" @submit="handleSubmit">
      <div class="form-container">
        <div class="fr-mt-md-1w full-mobile">
          <label class="fr-label fr-text--bold" for="shareType">{{
            t('sharefile.bytype-label')
          }}</label>
          <Field id="shareType" name="shareType" v-model="shareType" v-slot="{ field, meta }">
            <select
              v-bind="field"
              class="fr-select"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
            >
              <option value="full">{{ t('sharefile.full') }}</option>
              <option value="resume">{{ t('sharefile.resume') }}</option>
            </select>
          </Field>
          <ErrorMessage name="shareType" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
        <div class="full-mobile">
          <Field id="shareMethod" name="shareMethod" v-model="shareMethod" v-slot="{ field, meta }">
            <select
              v-bind="field"
              class="fr-select"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
            >
              <option value="mail">{{ t('sharefile.by-mail') }}</option>
              <option value="link">{{ t('sharefile.by-link') }}</option>
            </select>
          </Field>
          <ErrorMessage name="shareType" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
        <div v-if="shareMethod === 'mail'" class="full-mobile">
          <label class="fr-label" for="email">{{ t('sharefile.email-label') }}</label>
          <Field id="email" name="email" v-model="email" v-slot="{ field, meta }" rules="required">
            <input
              v-bind="field"
              class="form-control validate-required fr-input"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              :placeholder="`${t('sharefile.email-placeholder')}`"
              type="email"
              autocomplete="email"
              required
            />
          </Field>
          <ErrorMessage name="shareType" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
        <div v-if="shareMethod === 'link'" class="full-mobile">
          <input class="fr-input" type="text" read-only :value="getUrl()" />
        </div>
        <div class="full-mobile">
          <DfButton class="full-mobile" type="submit" :primary="true">{{
            shareMethod === 'mail' ? t('sharefile.share-btn-email') : t('sharefile.share-btn-copy')
          }}</DfButton>
        </div>
      </div>
    </Form>
    <h2 class="fr-h4 align-items--center fr-mt-5w" style="display: flex">
      {{ t('sharefile.view.title') }}
    </h2>
    <p>
      <span>
        {{ t('sharefile.view.text') }}
      </span>
      <br />
      <router-link :to="getFullFileUrl()" class="fr-btn fr-btn--secondary fr-mt-2w">
        <RiEyeLine aria-hidden="true" />
        <span class="text-center full-width">
          {{ t('sharefile.view.button') }}
        </span>
      </router-link>
    </p>
  </div>
</template>
<script setup lang="ts">
import { AnalyticsService } from '../../services/AnalyticsService'
import { OwnerService } from '../../services/OwnerService'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { ToastService } from '../../services/ToastService'
import { useTenantStore } from '../../stores/tenant-store'
import { computed, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { RiEyeLine } from '@remixicon/vue'

const store = useTenantStore()
const user = computed(() => store.user)
const { t } = useI18n()

const TENANT_URL = `https://${import.meta.env.VITE_TENANT_URL}`
const shareType = ref('full')
const shareMethod = ref('mail')
const email = ref('')

function handleSubmit() {
  if (shareMethod.value === 'mail') {
    sendMail()
  } else {
    copyLink()
  }
  return true
}

function sendMail() {
  AnalyticsService.shareByMail(shareType.value === 'full' ? 'full' : 'resume')
  OwnerService.sendFileByMail(email.value, shareType.value)
    .then(() => {
      ToastService.success('sharefile.sent-success')
      email.value = ''
      store.loadApartmentSharingLinks()
    })
    .catch(() => {
      ToastService.error()
    })
}

function getFullFileUrl() {
  return `/file/${user.value.apartmentSharing?.token}`
}

function getUrl() {
  if (shareType.value === 'full') {
    return `${TENANT_URL}/file/${user.value.apartmentSharing?.token}`
  }
  return `${TENANT_URL}/public-file/${user.value.apartmentSharing?.tokenPublic}`
}

function copyLink() {
  const url = getUrl()

  try {
    navigator.clipboard.writeText(url)
    ToastService.success('account.copied')
    AnalyticsService.copyLink(shareType.value === 'full' ? 'full' : 'resume')
  } catch (err) {
    ToastService.error('unable-to-coy')
    alert('Oops, unable to copy')
    throw new Error('Unable to copy')
  }
}
</script>

<style scoped lang="scss">
.form-container {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

select {
  min-width: 200px;
}
</style>
