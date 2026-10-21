<script lang="ts" setup>
import { useTemplateRef } from 'vue'

interface Props {
  pageTitle?: string | null
}

const { pageTitle = undefined } = defineProps<Props>()
const a11yTitle = useTemplateRef('a11yTitle')
defineExpose({ a11yTitle })
</script>

<template>
  <p v-if="pageTitle" ref="a11yTitle" class="visually-hidden" tabindex="-1">{{ pageTitle }}</p>
</template>
