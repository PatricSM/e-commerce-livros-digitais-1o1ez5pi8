import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Upload,
  Image as ImageIcon,
  FileText,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useProductStore } from '@/stores/useProductStore'
import { toast } from 'sonner'
import { Product } from '@/types'
import { uploadService } from '@/services/upload'

const productSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  author: z.string().min(2, 'Autor deve ter pelo menos 2 caracteres'),
  price: z.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.string().min(2, 'Categoria é obrigatória'),
  coverUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  kiwifyCheckoutLink: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
})

export default function ProductManagement() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    isLoading,
  } = useProductStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cover Image State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Book File State
  const [selectedBookFile, setSelectedBookFile] = useState<File | null>(null)
  const bookInputRef = useRef<HTMLInputElement>(null)

  // Ensure fetchProducts is only called once on mount
  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      author: '',
      price: 0,
      description: '',
      category: '',
      coverUrl: '',
      fileUrl: '',
      kiwifyCheckoutLink: '',
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl(editingProduct?.coverUrl || null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedBookFile(file)
    }
  }

  const clearBookFile = () => {
    setSelectedBookFile(null)
    if (bookInputRef.current) {
      bookInputRef.current.value = ''
    }
  }

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    // Validate cover image presence
    if (!values.coverUrl && !selectedFile && !editingProduct) {
      form.setError('coverUrl', { message: 'A imagem de capa é obrigatória' })
      return
    }

    setIsSubmitting(true)
    try {
      let finalCoverUrl = values.coverUrl
      let finalFileUrl = values.fileUrl

      // Upload Cover Image
      if (selectedFile) {
        try {
          finalCoverUrl = await uploadService.uploadFile(selectedFile)
        } catch (error: any) {
          toast.error(`Erro no upload da capa: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      }

      // Upload Book File
      if (selectedBookFile) {
        try {
          finalFileUrl = await uploadService.uploadFile(selectedBookFile)
        } catch (error: any) {
          toast.error(`Erro no upload do arquivo: ${error.message}`)
          setIsSubmitting(false)
          return
        }
      }

      if (!finalCoverUrl) {
        toast.error('Erro: URL da imagem não disponível')
        setIsSubmitting(false)
        return
      }

      const productData = {
        ...values,
        coverUrl: finalCoverUrl,
        fileUrl: finalFileUrl,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast.success('Produto atualizado com sucesso!')
      } else {
        await addProduct(productData as any)
        toast.success('Produto cadastrado com sucesso!')
      }
      setIsDialogOpen(false)
      form.reset()
      setEditingProduct(null)
      setSelectedFile(null)
      setPreviewUrl(null)
      setSelectedBookFile(null)
    } catch (error) {
      // Error is handled in store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setPreviewUrl(product.coverUrl)
    setSelectedFile(null)
    setSelectedBookFile(null)
    form.reset({
      title: product.title,
      author: product.author,
      price: product.price,
      description: product.description,
      category: product.category,
      coverUrl: product.coverUrl,
      fileUrl: product.fileUrl || '',
      kiwifyCheckoutLink: product.kiwifyCheckoutLink || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      toast.success('Produto removido com sucesso!')
    } catch (error) {
      // Error handled in store
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setPreviewUrl(null)
    setSelectedFile(null)
    setSelectedBookFile(null)
    form.reset({
      title: '',
      author: '',
      price: 0,
      description: '',
      category: '',
      coverUrl: '',
      fileUrl: '',
      kiwifyCheckoutLink: '',
    })
    setIsDialogOpen(true)
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do livro abaixo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Dom Casmurro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Machado de Assis"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Romance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kiwifyCheckoutLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link de Checkout Kiwify</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://pay.kiwify.com.br/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <FormLabel>Capa do Livro</FormLabel>
                  <div className="flex flex-col gap-4">
                    {previewUrl ? (
                      <div className="relative w-32 h-48 rounded-md overflow-hidden border border-border group">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-48 rounded-md border border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {previewUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="coverUrl"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.formState.errors.coverUrl &&
                      !selectedFile &&
                      !previewUrl && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.coverUrl.message}
                        </p>
                      )}
                  </div>
                </div>

                {/* Book File Upload */}
                <div className="space-y-2">
                  <FormLabel>Arquivo do Livro (PDF/EPUB)</FormLabel>
                  <div className="flex flex-col gap-4">
                    {(editingProduct?.fileUrl || selectedBookFile) && (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm truncate flex-1">
                          {selectedBookFile
                            ? selectedBookFile.name
                            : 'Arquivo atual disponível'}
                        </span>
                        {selectedBookFile && (
                          <button type="button" onClick={clearBookFile}>
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => bookInputRef.current?.click()}
                        className="w-full sm:w-auto"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {editingProduct?.fileUrl || selectedBookFile
                          ? 'Alterar Arquivo'
                          : 'Selecionar Arquivo'}
                      </Button>
                      <input
                        type="file"
                        ref={bookInputRef}
                        className="hidden"
                        accept=".pdf,.epub"
                        onChange={handleBookFileChange}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input placeholder="Sinopse do livro..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 rounded overflow-hidden bg-muted">
                        <img
                          src={product.coverUrl}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {product.title}
                    </div>
                  </TableCell>
                  <TableCell>{product.author}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    R$ {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá
                              permanentemente o produto "{product.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
