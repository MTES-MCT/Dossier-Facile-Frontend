import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const openModal = () => (isOpen.value = true)
  const closeModal = () => (isOpen.value = false)

  return { isOpen, openModal, closeModal }
})
