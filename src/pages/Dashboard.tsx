import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign,
  Plus,
  Eye,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useTranslation } from "@/hooks/useTranslation";

export default function Dashboard() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { t } = useTranslation();

  // Calculate real metrics from products
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, item) => sum + (item.cost_price * item.quantity), 0);
  const lowStockItems = products.filter(item => item.quantity <= item.low_stock_threshold).length;
  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);

  const stats = [
    {
      title: "Today's Sales",
      value: formatPrice(156800),
      description: "+12% from yesterday",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      description: `${totalItems} items in stock`,
      icon: Package,
      trend: "neutral"
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.toString(),
      description: "Need attention",
      icon: AlertTriangle,
      trend: "down"
    },
    {
      title: "Inventory Value",
      value: formatPrice(totalInventoryValue),
      description: "Current stock value",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentSales = [
    { id: 1, customer: "Marie Ngassa", items: 3, total: 25400, time: "10:30 AM" },
    { id: 2, customer: "Jean Kamga", items: 1, total: 45600, time: "09:45 AM" },
    { id: 3, customer: "Sarah Mballa", items: 5, total: 78200, time: "09:15 AM" },
    { id: 4, customer: "Paul Foka", items: 2, total: 32100, time: "08:50 AM" },
  ];

  const lowStockProducts = products
    .filter(item => item.quantity <= item.low_stock_threshold)
    .slice(0, 3)
    .map(item => ({
      name: item.name,
      stock: item.quantity,
      min: item.low_stock_threshold
    }));

  const quickActions = [
    {
      title: "Add Product",
      description: "Add new items to inventory",
      icon: Plus,
      action: () => navigate("/products"),
      color: "bg-primary"
    },
    {
      title: "New Sale",
      description: "Process a customer sale",
      icon: ShoppingCart,
      action: () => navigate("/sales"),
      color: "bg-secondary"
    },
    {
      title: "View Reports",
      description: "Check sales analytics",
      icon: BarChart3,
      action: () => navigate("/reports"),
      color: "bg-accent"
    },
    {
      title: "Check Stock",
      description: "Monitor inventory levels",
      icon: Eye,
      action: () => navigate("/inventory"),
      color: "bg-muted"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('Dashboard')}</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your boutique today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-primary' : 
                stat.trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={action.action}
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Latest transactions today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{sale.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.items} items • {sale.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatPrice(sale.total)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/reports")}>
              View All Sales
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-soft border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              Items that need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
           <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All products are well stocked!
                </p>
              ) : (
                lowStockProducts.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{item.name}</p>
                      <Badge variant="destructive" className="text-xs">
                        {item.stock} left
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-destructive h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(10, (item.stock / item.min) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/inventory?filter=low")}>
              View All Low Stock
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}