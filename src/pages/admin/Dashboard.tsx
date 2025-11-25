import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useProductStore } from '@/stores/useProductStore'
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
  LineChart,
  Line,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const products = useProductStore((state) => state.products)

  // Mock Data for Charts
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
      title: 'Total de Produtos',
      value: products.length,
      icon: Package,
      description: 'Livros cadastrados',
    },
    {
      title: 'Vendas Mensais',
      value: 'R$ 14.500',
      icon: DollarSign,
      description: '+12% em relação ao mês anterior',
    },
    {
      title: 'Usuários Ativos',
      value: '573',
      icon: Users,
      description: '+201 novos usuários',
    },
    {
      title: 'Taxa de Conversão',
      value: '3.2%',
      icon: TrendingUp,
      description: '+0.4% essa semana',
    },
  ]

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
              Visão geral do faturamento semestral.
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
    </div>
  )
}
