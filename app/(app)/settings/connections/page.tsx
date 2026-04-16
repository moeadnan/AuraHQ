import { Suspense } from 'react'
import { ConnectionsView } from '@/components/settings/ConnectionsView'

export default function ConnectionsPage() {
  return (
    <Suspense>
      <ConnectionsView />
    </Suspense>
  )
}
