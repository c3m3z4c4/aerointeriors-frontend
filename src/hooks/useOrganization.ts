import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export interface Organization { id: string; name: string; slug: string }

export function useOrganization() {
  return useQuery<Organization>({
    queryKey: ['organization'],
    queryFn: async () => {
      const { data } = await api.get('/organizations/default')
      return data
    },
    staleTime: Infinity,
  })
}
