import { supabase } from '@/lib/supabase/client'

export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await supabase.functions.invoke('file-upload', {
      body: formData,
    })

    if (error) {
      console.error('Edge function error:', error)
      throw new Error('Falha ao conectar com o servidor de upload.')
    }

    if (data?.error) {
      console.error('Upload error:', data.error)
      throw new Error(data.error || 'Erro ao fazer upload do arquivo.')
    }

    return data.url
  },
}
