import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartSheet } from '@/components/CartSheet'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSheet />
    </div>
  )
}
