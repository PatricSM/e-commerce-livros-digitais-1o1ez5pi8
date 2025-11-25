import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
})

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (values.email === 'admin@admin.com' && values.password === 'admin') {
        login({
          id: '1',
          name: 'Administrador',
          email: values.email,
          role: 'admin',
        })
        toast.success('Login realizado com sucesso!')
        navigate('/admin/dashboard')
      } else {
        toast.error('Credenciais inválidas. Tente admin@admin.com / admin')
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Acesso Administrativo
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o painel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@admin.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Dica: Use <strong>admin@admin.com</strong> e senha{' '}
              <strong>admin</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
