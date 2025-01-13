<template>
  <div class="fr-fieldset__element">
    <router-link :to="to" class="fr-radio-group fr-radio-rich">
      <input value="1" type="radio" :id="id" name="radio-rich-no-img" />
      <label class="fr-label" :for="id"><slot /></label>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import type { RouterLinkProps } from 'vue-router'

defineProps<{ to: RouterLinkProps['to'] }>()
const id = useId()
</script>
