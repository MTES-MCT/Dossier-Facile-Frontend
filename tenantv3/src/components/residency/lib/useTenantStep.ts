import { TENANT_COMPONENTS } from '@/components/editmenu/documents/DocumentType'
import { useIdentityDocumentLink } from '@/components/identityDocument/lib/identityDocumentLink'
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { useRouter } from 'vue-router'

const routeNames = Object.values(TENANT_COMPONENTS)

export function useTenantStep() {
  const router = useRouter()
  const residencyLink = useResidencyLink()
  const identityDocumentLink = useIdentityDocumentLink()
  const goToStep = (step: number) => {
    const name = routeNames[step]
    if (name === 'TenantIdentification') {
      router.push(identityDocumentLink.value)
      return
    }
    const to = name === 'TenantResidency' ? residencyLink.value : { name }
    router.push(to)
  }
  return { goToStep }
}
