import { supabase } from '@/lib/supabase/client'

export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await supabase.functions.invoke('uploader', {
      body: formData,
    })

    if (error) {
      console.error('Edge function error:', error)
      throw new Error(
        error.message || 'Falha na comunicação com o serviço de upload.',
      )
    }

    if (data?.error) {
      console.error('Upload error:', data.error)
      throw new Error(data.error || 'Erro ao processar o upload do arquivo.')
    }

    if (!data?.url) {
      throw new Error('URL do arquivo não retornada pelo servidor.')
    }

    return data.url
  },
}
