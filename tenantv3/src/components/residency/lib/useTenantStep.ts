import { TENANT_COMPONENTS } from '@/components/editmenu/documents/DocumentType'
import { useResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { useRouter } from 'vue-router'

const routeNames = Object.values(TENANT_COMPONENTS)

export function useTenantStep() {
  const router = useRouter()
  const residencyLink = useResidencyLink()
  const goToStep = (step: number) => {
    const name = routeNames[step]
    const to = name === 'TenantResidency' ? residencyLink.value : { name }
    router.push(to)
  }
  return { goToStep }
}
