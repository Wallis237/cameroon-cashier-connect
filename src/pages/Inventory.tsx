import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  History
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("increase");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  
  const { products, updateProduct, loading } = useProducts();

  const categories = ["all", ...Array.from(new Set(products.map(item => item.category)))];

  const getStockStatus = (item: any) => {
    if (item.quantity === 0) return "outofstock";
    if (item.quantity <= item.low_stock_threshold) return "low";
    if (item.quantity >= item.low_stock_threshold * 5) return "high";
    return "normal";
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "low") matchesStock = getStockStatus(item) === "low";
    if (stockFilter === "outofstock") matchesStock = getStockStatus(item) === "outofstock";
    if (stockFilter === "normal") matchesStock = getStockStatus(item) === "normal";
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleStockAdjustment = async () => {
    if (!selectedProduct) return;

    const newStock = adjustmentType === "increase" 
      ? selectedProduct.quantity + adjustmentQuantity
      : selectedProduct.quantity - adjustmentQuantity;

    if (newStock < 0) {
      toast({
        title: "Invalid Adjustment",
        description: "Stock cannot be negative",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProduct(selectedProduct.id, { quantity: newStock });
      
      toast({
        title: "Stock Adjusted",
        description: `${selectedProduct.name} stock ${adjustmentType === "increase" ? "increased" : "decreased"} by ${adjustmentQuantity}`,
      });

      setSelectedProduct(null);
      setAdjustmentQuantity(1);
      setAdjustmentReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  const totalInventoryValue = products.reduce((sum, item) => sum + (item.cost_price * item.quantity), 0);
  const lowStockItems = products.filter(item => getStockStatus(item) === "low").length;
  const outOfStockItems = products.filter(item => getStockStatus(item) === "outofstock").length;
  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground">
          Monitor stock levels and manage your inventory
        </p>
      </div>

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalInventoryValue)}</div>
            <p className="text-xs text-primary">Current stock value</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">{products.length} product types</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockItems}</div>
            <p className="text-xs text-amber-600">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockItems}</div>
            <p className="text-xs text-destructive">Immediate attention needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="normal">Normal Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Current stock levels and item details ({filteredProducts.length} items)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {products.length === 0 
                  ? "Start by adding products to your inventory"
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((item) => {
                const stockStatus = getStockStatus(item);
                const maxStock = item.low_stock_threshold * 10; // Estimated max capacity
                const stockPercentage = Math.min((item.quantity / maxStock) * 100, 100);
                
                return (
                  <div key={item.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          {stockStatus === "low" && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                          {stockStatus === "outofstock" && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        {item.barcode && (
                          <p className="text-sm text-muted-foreground">
                            Barcode: {item.barcode}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedProduct(item)}
                          >
                            <History className="h-4 w-4 mr-2" />
                            Adjust Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
                            <DialogDescription>
                              Increase or decrease stock levels for this item
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Current Stock: {item.quantity}</Label>
                              <div className="flex gap-2">
                                <Button
                                  variant={adjustmentType === "increase" ? "default" : "outline"}
                                  onClick={() => setAdjustmentType("increase")}
                                  className="flex-1"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Increase
                                </Button>
                                <Button
                                  variant={adjustmentType === "decrease" ? "default" : "outline"}
                                  onClick={() => setAdjustmentType("decrease")}
                                  className="flex-1"
                                >
                                  <Minus className="h-4 w-4 mr-2" />
                                  Decrease
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quantity">Quantity</Label>
                              <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={adjustmentQuantity}
                                onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reason">Reason (Optional)</Label>
                              <Textarea
                                id="reason"
                                placeholder="Enter reason for stock adjustment..."
                                value={adjustmentReason}
                                onChange={(e) => setAdjustmentReason(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleStockAdjustment}>
                              Apply Adjustment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Stock</p>
                        <p className="font-medium text-lg">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Low Stock Alert</p>
                        <p className="font-medium">{item.low_stock_threshold}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost Price</p>
                        <p className="font-medium">{formatPrice(item.cost_price)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Selling Price</p>
                        <p className="font-bold text-primary">{formatPrice(item.selling_price)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Stock Level</span>
                        <span>{item.quantity} units</span>
                      </div>
                      <Progress 
                        value={stockPercentage} 
                        className={`h-2 ${
                          stockStatus === "low" ? "text-destructive" :
                          stockStatus === "outofstock" ? "text-destructive" :
                          "text-primary"
                        }`}
                      />
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date(item.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}