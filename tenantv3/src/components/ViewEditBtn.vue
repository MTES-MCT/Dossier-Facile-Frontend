<template>
  <div style="display: flex">
    <button class="fr-btn fr-btn--secondary icon-btn" title="View" @click="view" v-if="canView">
      <i class="ri-eye-line color--primary fs-18 icons"></i>
    </button>
    <button class="fr-btn fr-btn--secondary icon-btn" title="Edit" @click="edit">
      <i class="ri-pencil-line color--primary fs-18 icons"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ view: []; edit: [] }>()

withDefaults(
  defineProps<{
    canView?: boolean
  }>(),
  {
    canView: true
  }
)

function view() {
  emit('view')
}
function edit() {
  emit('edit')
}
</script>

<style scoped lang="scss">
.fr-btn {
  box-shadow: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
}

.icon-btn {
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.icons {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
}
</style>
