<template>
  <div class="banner-content">
    <div class="banner-title">
      <VIcon name="ri:alert-fill" :scale="1.25" color="#b34000" />
      <span class="title-text">{{ title }}</span>
    </div>
    <div class="banner-description">
      <div class="expected-doc">
        <p class="doc-label">{{ expectedDocumentLabel }}</p>
        <BannerIconTextLine
          v-for="(line, i) in expectedLines"
          :key="'expected-' + i"
          icon-name="ri:check-line"
          icon-color="#18753c"
          :text="line"
          text-class="success-text"
        />
      </div>
      <div class="current-doc">
        <p class="doc-label">{{ currentDocumentLabel }}</p>
        <BannerIconTextLine
          v-for="(line, i) in currentLines"
          :key="'extracted-' + i"
          icon-name="ri:close-line"
          icon-color="#b34000"
          :text="line"
          text-class="error-text"
        />
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
import BannerIconTextLine from './BannerIconTextLine.vue'

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
@import './analysisBannerLayout.css';

.error-text {
  color: #b34000;
}

.success-text {
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
