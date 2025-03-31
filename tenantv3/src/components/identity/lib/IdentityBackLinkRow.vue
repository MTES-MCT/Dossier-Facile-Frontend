<template>
  <BackLinkRow :label="label" @click="onClick" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useParentRoute } from '../../common/lib/useParentRoute'
import BackLinkRow from '@/components/common/BackLinkRow.vue'

defineProps<{ label: string }>()

const router = useRouter()
const parentRoute = useParentRoute()

const onClick = () => {
  router.push(parentRoute.value)
}
</script>
