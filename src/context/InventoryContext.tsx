"use client";
import React, { createContext, useContext, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: { [talla: string]: number };
  enabled: boolean;
};

type SaleItem = {
  productId: number;
  productName: string; 
  talla: string;
  stock: number;
  price: number;
};

type Sale = {
  id: number;
  date: string;
  items: SaleItem[];
  total: number;
  type: "detal" | "mayor";
};

type InventoryContextType = {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  toggleProduct: (id: number) => void;
  addSale: (items: Omit<SaleItem, "productName">[], type: "detal" | "mayor") => void; 
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);

    const addProduct = (product: Product) => {
      setProducts((prev) => [...prev, product]);
    };

    const updateProduct = (updatedProduct: Product) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    };

    const toggleProduct = (id: number) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
      );
    };

    const addSale = (items: Omit<SaleItem, "productName">[], type: "detal" | "mayor") => {
    const newSale: Sale = {
      id: Date.now(),
      date: new Date().toISOString(),
      type,
      items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          ...item,
          productName: product ? product.name : "Desconocido",
        };
      }),
      total: items.reduce((acc, item) => acc + item.price * item.stock, 0),
    };

    // Actualiza el stock de todos los productos y tallas vendidos
    const updatedProducts = products.map((p) => {
      // Busca todos los items vendidos de este producto
      const itemsSold = newSale.items.filter((i) => i.productId === p.id);
      if (itemsSold.length > 0) {
        const updatedStock = { ...p.stock };
        itemsSold.forEach((i) => {
          // Solo descuenta si la talla existe y hay suficiente stock
          if (updatedStock[i.talla] !== undefined) {
            updatedStock[i.talla] = Math.max(0, updatedStock[i.talla] - i.stock);
          }
        });
        return { ...p, stock: updatedStock };
      }
      return p;
    });

    setProducts(updatedProducts);
    setSales((prev) => [...prev, newSale]);
  };

  return (
    <InventoryContext.Provider
      value={{ products, sales, addProduct, updateProduct, toggleProduct, addSale }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory debe usarse dentro de InventoryProvider");
  return context;
};
