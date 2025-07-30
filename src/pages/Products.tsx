import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  MoreHorizontal
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  createdAt: string;
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Women's Handbag",
      category: "Accessories",
      costPrice: 25000,
      sellPrice: 45000,
      stock: 12,
      minStock: 5,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Men's Sneakers",
      category: "Footwear",
      costPrice: 35000,
      sellPrice: 65000,
      stock: 8,
      minStock: 3,
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      name: "Summer Dress",
      category: "Clothing",
      costPrice: 18000,
      sellPrice: 35000,
      stock: 15,
      minStock: 8,
      createdAt: "2024-01-13"
    },
    {
      id: "4",
      name: "Watch",
      category: "Accessories",
      costPrice: 75000,
      sellPrice: 125000,
      stock: 5,
      minStock: 2,
      createdAt: "2024-01-12"
    }
  ]);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      costPrice: Number(formData.get("costPrice")),
      sellPrice: Number(formData.get("sellPrice")),
      stock: Number(formData.get("stock")),
      minStock: Number(formData.get("minStock")),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [...prev, newProduct]);
    setIsAddDialogOpen(false);
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory`,
    });
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.target as HTMLFormElement);
    
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      costPrice: Number(formData.get("costPrice")),
      sellPrice: Number(formData.get("sellPrice")),
      stock: Number(formData.get("stock")),
      minStock: Number(formData.get("minStock"))
    };

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been removed from inventory`,
    });
  };

  const ProductForm = ({ product, onSubmit }: { product?: Product; onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={product?.category}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Footwear">Footwear</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Beauty">Beauty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price (₣)</Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            defaultValue={product?.costPrice}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellPrice">Sell Price (₣)</Label>
          <Input
            id="sellPrice"
            name="sellPrice"
            type="number"
            defaultValue={product?.sellPrice}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Current Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Minimum Stock</Label>
          <Input
            id="minStock"
            name="minStock"
            type="number"
            defaultValue={product?.minStock}
            placeholder="0"
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {product ? "Update Product" : "Add Product"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory and product catalog
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product
              </DialogDescription>
            </DialogHeader>
            <ProductForm onSubmit={handleAddProduct} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const profitMargin = ((product.sellPrice - product.costPrice) / product.sellPrice * 100).toFixed(1);
          const isLowStock = product.stock <= product.minStock;
          
          return (
            <Card key={product.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cost Price</p>
                    <p className="font-medium">{formatPrice(product.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sell Price</p>
                    <p className="font-bold text-primary">{formatPrice(product.sellPrice)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      <span className={isLowStock ? "text-destructive font-medium" : ""}>
                        {product.stock}
                      </span>
                      {isLowStock && (
                        <Badge variant="destructive" className="text-xs">Low</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit Margin</p>
                    <p className="font-medium text-primary">{profitMargin}%</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm product={editingProduct} onSubmit={handleEditProduct} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}