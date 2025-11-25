import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/useCartStore'
import { Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

export function CartSheet() {
  const { items, isOpen, setIsOpen, removeItem, clearCart } = useCartStore()

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleCheckout = () => {
    toast.success('Compra finalizada com sucesso! (Simulação)')
    clearCart()
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho de Compras
          </SheetTitle>
          <SheetDescription>
            Revise seus itens antes de finalizar a compra.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 my-4 pr-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mb-2 opacity-20" />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="grid gap-1">
                      <h3 className="font-medium leading-none line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.author}
                      </p>
                      <p className="text-sm font-medium">
                        R$ {item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto w-fit p-0 text-destructive hover:text-destructive/90 hover:bg-transparent"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <SheetFooter>
            <Button
              className="w-full"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              Finalizar Compra
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
