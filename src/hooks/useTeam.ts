import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useOrganization } from './useOrganization'

export interface TeamMember {
  id: string; orgId: string; name: string; role_en: string; role_es: string;
  bio_en: string; bio_es: string; photo?: string; linkedIn?: string; order: number; visible: boolean;
}

export function useTeam() {
  const { data: org } = useOrganization()
  return useQuery<TeamMember[]>({
    queryKey: ['team', org?.id],
    queryFn: async () => { const { data } = await api.get(`/team?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })
}

export function useCreateTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<TeamMember>) => { const { data: res } = await api.post('/team', data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}

export function useUpdateTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<TeamMember> & { id: string }) => { const { data: res } = await api.put(`/team/${id}`, data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}

export function useDeleteTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/team/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}
