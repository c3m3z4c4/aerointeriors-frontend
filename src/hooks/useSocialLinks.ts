import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useOrganization } from './useOrganization'

export interface SocialLink { id: string; orgId: string; platform: string; url: string; order: number }

export function useSocialLinks() {
  const { data: org } = useOrganization()
  return useQuery<SocialLink[]>({
    queryKey: ['social-links', org?.id],
    queryFn: async () => { const { data } = await api.get(`/social-links?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })
}
