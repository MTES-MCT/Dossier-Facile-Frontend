<template>
  <div class="banner-content">
    <div class="banner-title">
      <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
      <span class="title-text">{{ title }}</span>
    </div>
    <div class="banner-description">
      <div class="expected-doc">
        <p class="doc-label">{{ expectedDocumentLabel }}</p>
        <div v-for="(line, i) in expectedLines" :key="'expected-' + i" class="doc-line">
          <VIcon name="ri:check-line" :scale="1.25" color="#18753c" />
          <span class="success-text">{{ line }}</span>
        </div>
      </div>
      <div class="current-doc">
        <p class="doc-label">{{ currentDocumentLabel }}</p>
        <div v-for="(line, i) in currentLines" :key="'extracted-' + i" class="doc-line">
          <VIcon name="ri:close-line" :scale="1.25" color="#b34000" />
          <span class="error-text">{{ line }}</span>
        </div>
      </div>
    </div>
    <p class="explain-link-text">
      {{ notMatchingLabel }}
      <button type="button" class="explain-link" @click="emit('explain')">
        {{ explainLinkLabel }}
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'

defineProps<{
  title: string
  currentLines: string[]
  expectedLines: string[]
  currentDocumentLabel: string
  expectedDocumentLabel: string
  notMatchingLabel: string
  explainLinkLabel: string
}>()

const emit = defineEmits<{
  explain: []
}>()
</script>

<style scoped>
.banner-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.banner-title {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.title-text {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #b34000;
}

.banner-description {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.doc-label {
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
  margin: 0;
}

.current-doc,
.expected-doc {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.doc-line {
  display: flex;
  align-items: flex-start;
}

.error-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #b34000;
}

.success-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #18753c;
}

.explain-link-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
  margin: 0.75rem 0 0;
}

.explain-link {
  color: #161616;
  text-decoration: underline;
  font-weight: 400;
  font-family: inherit;
  font-size: inherit;
  background: none;
  background-image: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>
