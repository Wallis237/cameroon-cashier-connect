import { useState, useEffect } from 'react';

// Mock data for sales, products, and analytics when not authenticated
export function useMockSales() {
  const [sales, setSales] = useState([
    {
      id: "1",
      customer_name: "Marie Ngassa",
      items: [{ name: "Summer Dress", quantity: 2, price: 12700 }, { name: "Sandals", quantity: 1, price: 8500 }],
      total: 25400,
      created_at: new Date().toISOString(),
      user_id: "demo"
    },
    {
      id: "2", 
      customer_name: "Jean Kamga",
      items: [{ name: "Men's Shirt", quantity: 1, price: 45600 }],
      total: 45600,
      created_at: new Date(Date.now() - 45 * 60000).toISOString(),
      user_id: "demo"
    },
    {
      id: "3",
      customer_name: "Sarah Mballa", 
      items: [{ name: "Evening Dress", quantity: 1, price: 78200 }],
      total: 78200,
      created_at: new Date(Date.now() - 75 * 60000).toISOString(),
      user_id: "demo"
    },
    {
      id: "4",
      customer_name: "Paul Foka",
      items: [{ name: "Leather Jacket", quantity: 1, price: 32100 }],
      total: 32100,
      created_at: new Date(Date.now() - 100 * 60000).toISOString(),
      user_id: "demo"
    }
  ]);

  return { sales, loading: false };
}

export function useMockProducts() {
  const [products, setProducts] = useState([
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
      user_id: "demo"
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
      user_id: "demo"
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
      user_id: "demo"
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
      user_id: "demo"
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
      user_id: "demo"
    }
  ]);

  const updateProduct = async (id: string, updates: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    return { error: null };
  };

  const addProduct = async (productData: any) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "demo"
    };
    setProducts(prev => [...prev, newProduct]);
    return { error: null };
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return { error: null };
  };

  const updateStock = async (id: string, quantityChange: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, p.quantity + quantityChange) } : p
    ));
    return { error: null };
  };

  return { 
    products, 
    loading: false, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock,
    refetch: () => {}
  };
}