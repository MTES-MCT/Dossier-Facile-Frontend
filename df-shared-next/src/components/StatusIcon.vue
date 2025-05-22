<template>
  <div v-if="icon" class="icons">
    <component :is="icon" size="14px" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import {
  RiAlertLine,
  RiArrowRightLine,
  RiAttachmentLine,
  RiCloseCircleFill,
  RiCloseCircleLine,
  RiGroupLine,
  RiPassValidLine,
  RiTeamLine,
  RiTimeLine,
  RiUserLine,
  RiVerifiedBadgeLine
} from '@remixicon/vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status: string
    warn?: boolean
  }>(),
  {
    warn: false
  }
)

const icon = computed(() => {
  switch (props.status) {
    case 'EMPTY':
      return RiArrowRightLine
    case 'FILLED':
      return RiAttachmentLine
    case 'TO_PROCESS':
      return RiTimeLine
    case 'VALIDATED':
      return RiVerifiedBadgeLine
    case 'DECLINED':
      return RiCloseCircleFill
    case 'NAME':
      return RiPassValidLine
    case 'ALONE':
      return RiUserLine
    case 'COUPLE':
      return RiGroupLine
    case 'GROUP':
      return RiTeamLine
    case 'INCOMPLETE':
      if (props.warn) {
        return RiAlertLine
      }
      return RiCloseCircleLine
  }
  return undefined
})
</script>

<style scoped lang="scss">
.icons {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}
</style>
