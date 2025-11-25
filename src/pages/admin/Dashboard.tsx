import { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useProductStore } from '@/stores/useProductStore'
import { useSalesStore } from '@/stores/useSalesStore'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const { products, fetchProducts } = useProductStore()
  const { sales, fetchSales, isLoading: isLoadingSales } = useSalesStore()

  useEffect(() => {
    fetchProducts()
    fetchSales()
  }, [fetchProducts, fetchSales])

  // Calculate Stats
  const totalSalesAmount = sales
    .filter((s) => s.status === 'paid' || s.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const uniqueCustomers = new Set(sales.map((s) => s.buyerEmail)).size

  // Mock Data for Charts (mixed with real data logic if possible, but keeping simple for now)
  // In a real app, we would aggregate `sales` by month
  const salesData = [
    { name: 'Jan', total: 1200 },
    { name: 'Fev', total: 2100 },
    { name: 'Mar', total: 1800 },
    { name: 'Abr', total: 2400 },
    { name: 'Mai', total: 3200 },
    { name: 'Jun', total: 3800 },
  ]

  const categoryData = products.reduce(
    (acc, product) => {
      const existing = acc.find((item) => item.name === product.category)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: product.category, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]

  const stats = [
    {
      title: 'Total de Vendas',
      value: `R$ ${totalSalesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: 'Receita total aprovada',
    },
    {
      title: 'Produtos Ativos',
      value: products.length,
      icon: Package,
      description: 'Livros no catálogo',
    },
    {
      title: 'Clientes Únicos',
      value: uniqueCustomers,
      icon: Users,
      description: 'Compradores distintos',
    },
    {
      title: 'Transações',
      value: sales.length,
      icon: ShoppingCart,
      description: 'Total de pedidos recebidos',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'approved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'refunded':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      case 'pending':
      case 'waiting_payment':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      paid: 'Pago',
      approved: 'Aprovado',
      refunded: 'Reembolsado',
      chargedback: 'Chargeback',
      pending: 'Pendente',
      waiting_payment: 'Aguardando Pagamento',
      refused: 'Recusado',
    }
    return map[status.toLowerCase()] || status
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas por Mês</CardTitle>
            <CardDescription>
              Visão geral do faturamento semestral (Simulado).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Vendas
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  R$ {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produtos por Categoria</CardTitle>
            <CardDescription>Distribuição do catálogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
          <CardDescription>
            Últimas transações processadas via Kiwify.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingSales ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando vendas...
                  </TableCell>
                </TableRow>
              ) : sales.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhuma venda registrada ainda.
                  </TableCell>
                </TableRow>
              ) : (
                sales.slice(0, 10).map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {format(new Date(sale.purchaseDate), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{sale.buyerName}</span>
                        <span className="text-xs text-muted-foreground">
                          {sale.buyerEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(sale.status)}
                        variant="outline"
                      >
                        {getStatusLabel(sale.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {sale.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
