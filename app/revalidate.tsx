'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useCountdown } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'

// Could use something more robust and flexible like SWR's refreshInterval
// or useQuery's refetchInterval, but for the sake of simplicity, we'll just
// use a simple countdown timer, combined with a router refresh, to revalidate
// the fetch call made from RSC.
export function Revalidate() {
  const router = useRouter()
  const { toast } = useToast()

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  })

  React.useEffect(() => {
    if (count === 0) {
      router.refresh()
      resetCountdown()
      toast({
        title: 'Data refreshed! 🎉',
        variant: 'success',
      })
    }

    startCountdown()
  }, [startCountdown, resetCountdown, count, router, toast])

  return <div className="text-sm text-gray-600 mt-6">Revalidate in {count}</div>
}
