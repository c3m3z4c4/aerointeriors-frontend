import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useOrganization } from './useOrganization'

export interface Certification {
  id: string; orgId: string; title_en: string; title_es: string;
  issuer: string; logo?: string; issueDate: string; credUrl?: string; visible: boolean; order: number;
}

export function useCertifications() {
  const { data: org } = useOrganization()
  return useQuery<Certification[]>({
    queryKey: ['certifications', org?.id],
    queryFn: async () => { const { data } = await api.get(`/certifications?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })
}

export function useCreateCertification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Certification>) => { const { data: res } = await api.post('/certifications', data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  })
}

export function useUpdateCertification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Certification> & { id: string }) => { const { data: res } = await api.put(`/certifications/${id}`, data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  })
}

export function useDeleteCertification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/certifications/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certifications'] }),
  })
}
