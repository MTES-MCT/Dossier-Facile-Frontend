<template>
  <div class="display--flex">
    <button v-if="canView" class="fr-btn fr-btn--secondary icon-btn" title="View" @click="view">
      <RiEyeLine size="26px" class="color--primary icons" aria-hidden="true" />
    </button>
    <button class="fr-btn fr-btn--secondary icon-btn" title="Edit" @click="edit">
      <RiPencilLine size="26px" class="color--primary icons" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { RiEyeLine, RiPencilLine } from '@remixicon/vue'

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
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  justify-content: center;
}

.icons {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
}
</style>
