<template>
  <BackLinkRow :label="label" @click="onClick">
    <ModalComponent v-if="showChangeSituation" @close="ignore">
      <template #body>
        <p>
          <strong>Attention</strong>, toute modification de votre situation supprimera vos
          justificatifs de revenus.
        </p>
        <p>Vous devrez ajouter les documents correspondant à votre nouvelle situation.</p>
      </template>
      <template #footer>
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <DfButton primary @click="ignore">Annuler</DfButton>
          </li>
          <li>
            <DfButton @click="confirm">Supprimer mes documents</DfButton>
          </li>
        </ul>
      </template>
    </ModalComponent>
  </BackLinkRow>
</template>

<script setup lang="ts">
import { useRoute, useRouter, type RouterLinkProps } from 'vue-router'
import { computed, ref } from 'vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import { useTenantStore } from '@/stores/tenant-store'
import BackLinkRow from '@/components/common/BackLinkRow.vue'

const props = defineProps<{ label: string; to: RouterLinkProps['to'] }>()
const emit = defineEmits<{ edit: [] }>()
const route = useRoute()
const router = useRouter()
const store = useTenantStore()

const showChangeSituation = ref(false)

const document = computed(() =>
  store.financialDocuments.find((d) => d.id === Number(route.params.docId))
)
const onClick = () => {
  emit('edit')
  if (document.value?.documentCategory) {
    showChangeSituation.value = true
  } else {
    router.push(props.to)
  }
}

const confirm = async () => {
  const docId = document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  router.push(props.to)
}

const ignore = () => {
  showChangeSituation.value = false
}
</script>
