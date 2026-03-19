import { defineStore } from 'pinia'
import { ref } from 'vue'

type ModalID = 'cookieConsent' | 'deleteAccount'

export const useModalStore = (id: ModalID) => {
  const store = defineStore(`modal-${id}`, () => {
    const isOpen = ref(false)

    const openModal = () => (isOpen.value = true)

    const closeModal = () => (isOpen.value = false)

    return { isOpen, openModal, closeModal }
  })

  return store()
}
