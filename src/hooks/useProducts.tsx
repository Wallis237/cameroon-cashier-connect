import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  low_stock_threshold: number;
  barcode?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mock products for demo when not authenticated
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Women's Handbag",
      category: "Accessories",
      cost_price: 15000,
      selling_price: 25000,
      quantity: 2,
      low_stock_threshold: 10,
      barcode: "BAG001",
      description: "Elegant leather handbag",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2", 
      name: "Men's Sneakers",
      category: "Footwear",
      cost_price: 20000,
      selling_price: 35000,
      quantity: 1,
      low_stock_threshold: 5,
      barcode: "SHOE001",
      description: "Comfortable running sneakers",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Summer Dress", 
      category: "Clothing",
      cost_price: 8000,
      selling_price: 12700,
      quantity: 3,
      low_stock_threshold: 8,
      barcode: "DRESS001",
      description: "Light summer dress",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Evening Dress",
      category: "Clothing", 
      cost_price: 50000,
      selling_price: 78200,
      quantity: 15,
      low_stock_threshold: 5,
      barcode: "DRESS002",
      description: "Elegant evening dress",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Men's Shirt",
      category: "Clothing",
      cost_price: 25000,
      selling_price: 45600,
      quantity: 8,
      low_stock_threshold: 6,
      barcode: "SHIRT001", 
      description: "Formal business shirt",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  const fetchProducts = async () => {
    if (!user) {
      // Use mock data when not authenticated
      setProducts(mockProducts);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data on error
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user) {
        // Mock addition for demo mode
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
        
        toast({
          title: "Success",
          description: "Product added successfully (demo mode)",
        });

        return newProduct;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      if (!user) {
        // Mock update for demo mode
        setProducts(prev => 
          prev.map(product => 
            product.id === id 
              ? { ...product, ...updates, updated_at: new Date().toISOString() }
              : product
          )
        );
        
        toast({
          title: "Success",
          description: "Product updated successfully (demo mode)",
        });
        
        return products.find(p => p.id === id);
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      if (!user) {
        // Mock deletion for demo mode
        setProducts(prev => prev.filter(product => product.id !== id));
        
        toast({
          title: "Success",
          description: "Product deleted successfully (demo mode)",
        });
        return;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const updateStock = async (id: string, quantityChange: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newQuantity = Math.max(0, product.quantity + quantityChange);
    return updateProduct(id, { quantity: newQuantity });
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    refetch: fetchProducts
  };
}