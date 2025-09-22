import { TENANT_COMPONENTS } from '@/components/editmenu/documents/DocumentType'
import { useIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { useRouter } from 'vue-router'

const routeNames = Object.values(TENANT_COMPONENTS)

export function useTenantStep() {
  const router = useRouter()
  const residencyLink = useResidencyLink()
  const identityDocumentLink = useIdentityDocumentLink()
  const getPage = (step: number) => {
    const name = routeNames[step]
    if (name === 'TenantIdentification') {
      return identityDocumentLink.value
    }
    if (name === 'TenantResidency') {
      return residencyLink.value
    }
    return { name }
  }
  const goToStep = (step: number) => router.push(getPage(step))
  return { getPage, goToStep }
}
