<template>
  <div class="password-meter-bar" :class="pclass"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ password: string }>()
const emit = defineEmits<{ score: [score: number] }>()

function calculateScore(password: string): number {
  let score = 0
  let length = 0
  let specialChar = 0
  let caseMix = 0
  let numCharMix = 0

  const specialCharRegex = /[^A-Za-z0-9]/g
  const lowercaseRegex = /(.*[a-z].*)/g
  const uppercaseRegex = /(.*[A-Z].*)/g
  const numberRegex = /(.*[0-9].*)/g
  const repeatCharRegex = /(\w)(\1+\1+\1+\1+)/g
  const hasSpecialChar = specialCharRegex.test(password)
  const hasLowerCase = lowercaseRegex.test(password)
  const hasUpperCase = uppercaseRegex.test(password)
  const hasNumber = numberRegex.test(password)
  const hasRepeatChars = repeatCharRegex.test(password)

  if (password.length < 5) {
    return score
  }

  if ((hasLowerCase || hasUpperCase) && hasNumber) {
    numCharMix = 1
  }

  if (hasUpperCase && hasLowerCase) {
    caseMix = 1
  }

  if ((hasLowerCase || hasUpperCase || hasNumber) && hasSpecialChar) {
    specialChar = 1
  }

  if (password.length > 8) {
    length = 1
  }

  if (password.length > 12 && !hasRepeatChars) {
    length = 2
  }

  if (password.length > 25 && !hasRepeatChars) {
    length = 3
  }

  score = length + specialChar + caseMix + numCharMix

  if (score > 4) {
    score = 4
  }
  return score
}

const pclass = computed(() => {
  if (!props.password) {
    return null
  }
  const score = calculateScore(props.password)
  emit('score', score)
  switch (score) {
    case 1:
      return 'orange'
    case 2:
      return 'yellow'
    case 3:
      return 'light-green'
    case 4:
      return 'dark-green'
    default:
      return 'red'
  }
})
</script>

<style scoped lang="scss">
.password-meter-bar {
  border-radius: 2px;
  transition: all 0.2s linear;
  height: 5px;
  margin-top: 8px;

  &.red {
    background-color: #f95e68;
    width: 20%;
  }

  &.orange {
    background-color: #fb964d;
    width: 40%;
  }

  &.yellow {
    background-color: #fdd244;
    width: 60%;
  }

  &.light-green {
    background-color: #b0dc53;
    width: 80%;
  }

  &.dark-green {
    background-color: #35cc62;
    width: 100%;
  }
}
</style>
