import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/AdminSidebar'
import { useAuthStore } from '@/stores/useAuthStore'

export default function AdminLayout() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold">Painel Administrativo</h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
