import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useOrganization } from './useOrganization'

export interface Project {
  id: string; orgId: string; title_en: string; title_es: string;
  description_en: string; description_es: string; images: string[];
  category: string; aircraftType: string; client?: string; year: number;
  featured: boolean; visible: boolean; order: number; tags: string[]; createdAt: string;
}

export function useProjects() {
  const { data: org } = useOrganization()
  return useQuery<Project[]>({
    queryKey: ['projects', org?.id],
    queryFn: async () => { const { data } = await api.get(`/projects?orgId=${org!.id}`); return data },
    enabled: !!org?.id,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Project>) => { const { data: res } = await api.post('/projects', data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => { const { data: res } = await api.put(`/projects/${id}`, data); return res },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/projects/${id}`) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}
