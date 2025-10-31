<template>
  <FilePreview :user />
</template>

<script setup lang="ts">
import FilePreview from '@/components/FilePreview.vue'
import { useTenantStore } from '@/stores/tenant-store'
import type { FileUser } from 'df-shared-next/src/models/FileUser'
import { computed } from 'vue'

const store = useTenantStore()

const user = computed<FileUser>(() => ({
  id: store.user.apartmentSharing.id!,
  applicationType: store.user.apartmentSharing.applicationType,
  tenants: [store.user],
  dossierPdfUrl: store.user.apartmentSharing.dossierPdfUrl,
  dossierPdfDocumentStatus: 'TODO',
  status: store.user.apartmentSharing.status,
  lastUpdateDate: store.user.lastUpdateDate
}))
</script>
