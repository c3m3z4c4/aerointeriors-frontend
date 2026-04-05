import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useOrganization } from './useOrganization'

export function useSiteSettings() {
  const { data: org } = useOrganization()
  return useQuery({
    queryKey: ['site-settings', org?.id],
    queryFn: async () => {
      const { data } = await api.get(`/site-settings?orgId=${org!.id}`)
      return data
    },
    enabled: !!org?.id,
  })
}

export function useUpdateSiteSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const { data: res } = await api.put('/site-settings', data)
      return res
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['site-settings'] }),
  })
}
