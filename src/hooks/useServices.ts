import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useOrganization } from './useOrganization'

export interface Service {
  id: string; orgId: string; title_en: string; title_es: string;
  description_en: string; description_es: string; icon: string;
  image?: string; order: number; visible: boolean;
}

export function useServices() {
  const { data: org } = useOrganization()
  return useQuery<Service[]>({
    queryKey: ['services', org?.id],
    queryFn: async () => { const { data } = await api.get(`/services?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Service>) => { const { data: res } = await api.post('/services', data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Service> & { id: string }) => { const { data: res } = await api.put(`/services/${id}`, data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/services/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}
