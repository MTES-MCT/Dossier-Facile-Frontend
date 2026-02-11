<template>
  <div class="logo-container" :class="logoClass">
    <a v-if="href" :href="href" class="logo-link" rel="noopener nofollow" target="_blank">
      <img
        :alt="imageAlt"
        :height="height"
        :src="image"
        :width="width"
        loading="lazy"
        class="partner-logo"
      />
    </a>
    <img
      v-else
      :alt="name"
      :height="height"
      :src="image"
      :width="width"
      loading="lazy"
      class="partner-logo"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    image: string
    href?: string
    width?: string
    height?: string
    title?: string
    logoClass?: string
  }>(),
  {
    href: undefined,
    width: '60',
    height: '60',
    title: undefined,
    logoClass: ''
  }
)

const imageAlt = computed(() => props.title ?? `aller sur le site ${props.name} (nouvelle fenêtre)`)
</script>

<style scoped>
.logo-container:focus-within {
  outline-style: solid;
  outline-color: #0a76f6;
}
a.logo-link:focus {
  outline-style: none;
}
a.logo-link:active {
  background: none;
}
a.logo-link::after {
  content: none;
}
a.logo-link::before {
  content: '';
  position: absolute;
  inset: 0;
}

.logo-link {
  box-shadow: none;
  background-image: none;
}

.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background-color: white;
}

.partner-logo {
  object-fit: contain;
}
</style>
