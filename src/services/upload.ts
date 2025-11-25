import { supabase } from '@/lib/supabase/client'

export const uploadService = {
  async uploadCover(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await supabase.functions.invoke('storage-upload', {
      body: formData,
    })

    if (error) {
      console.error('Edge function error:', error)
      throw new Error('Falha ao conectar com o servidor de upload.')
    }

    if (data?.error) {
      console.error('Upload error:', data.error)
      throw new Error(data.error || 'Erro ao fazer upload da imagem.')
    }

    return data.url
  },
}
