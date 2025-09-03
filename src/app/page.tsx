"use client";
import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import SalesForm from "@/components/SalesForm";
import SalesHistory from "@/components/SalesHistory";
import { Product } from "../data/types"; 
import { fetchProducts, saveProduct, updateProductStock, updateProduct, deleteProduct } from "../data/supabaseProducts";
import { saveSale, fetchSales } from "../data/supabaseSales";
import { Sale } from "../data/types";

/* export type Sale = {
  id: string;
  productId: string;
  productName: string;
  size: string;
  color: string;
  stock: number;
  date: string;
  price: number;
}; */

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSalesForm, setShowSalesForm] = useState(false); 
  const [showSalesHistory, setShowSalesHistory] = useState(false);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const handleSaveProduct = async (product: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(product);
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? product : p))
        );
        setEditingProduct(null);
      } else {
        await saveProduct(product);
        setProducts((prev) => [...prev, product]);
      }
      setShowForm(false);
    } catch (error) {
      alert("Error guardando producto en la base de datos");
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };
/* 
  const handleSale = async (sale: Omit<Sale, "id" | "date" | "productName">) => {
    const product = products.find((p) => p.id === sale.productId);
    if (!product) return;

    const updatedSizes = product.sizes.map((s) =>
      s.size === sale.size ? { ...s, stock: s.stock - sale.stock } : s
    );

    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      productName: product.name,
    };

    try {
      await saveSale(newSale);
      await updateProductStock(product.id, updatedSizes);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, sizes: updatedSizes } : p
        )
      );
      setSales((prevSales) => [...prevSales, newSale]);
      setShowSalesForm(false);
    } catch (error) {
      alert("Error guardando venta o actualizando stock en la base de datos");
      console.error(error);
    }
  }; */

  const handleSale = async (sale: Omit<Sale, "id" | "date">) => {
  const product = products.find((p) => p.id === sale.productId);
  if (!product) return;

  // Actualizar stock
  const updatedSizes = product.sizes.map((s) =>
    s.size === sale.size && s.color === sale.color
      ? { ...s, stock: s.stock - sale.stock }
      : s
  );

  const newSale: Sale = {
    ...sale,
    id: Date.now(),
    date: new Date().toISOString(),
  };

  try {
    await saveSale(newSale); // Función Supabase
    await updateProductStock(product.id, updatedSizes);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, sizes: updatedSizes } : p
      )
    );

    setSales((prev) => [...prev, newSale]);
    setShowSalesForm(false);
  } catch (error) {
    console.error("Error guardando venta o actualizando stock:", error);
    alert("Error guardando venta o actualizando stock");
  }
};



  const handleShowSalesHistory = async () => {
    try {
      const ventas = await fetchSales();
      setSales(ventas);
      setShowSalesHistory(true);
    } catch (error) {
      alert("Error cargando historial de ventas");
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Error eliminando producto");
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 pb-4 pt-4 text-gray-800 text-center sm:text-left">
        📦 Inventario Bluestore
      </h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 pb-4 justify-center sm:justify-start text-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-4 py-2 rounded shadow transition"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          ➕ Agregar nuevo producto
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-black font-semibold px-4 py-2 rounded shadow transition"
          onClick={() => setShowSalesForm(true)}
        >
          🛒 Registrar venta
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-black font-semibold px-4 py-2 rounded shadow transition"
          onClick={handleShowSalesHistory}
        >
          📊 Historial de ventas
        </button>
      </div>

      <div className="space-y-6 text-center">
        {showForm && (
          <ProductForm
            onSave={handleSaveProduct}
            editingProduct={editingProduct}
            onCancel={() => setShowForm(false)}
          />
        )}

        {showSalesForm && (
          <SalesForm
            products={products}
            onSale={handleSale}
            onCancel={() => setShowSalesForm(false)}
          />
        )}

        {showSalesHistory && (
          <SalesHistory
            sales={sales}
            onCancel={() => setShowSalesHistory(false)}
          />
        )}

        <div className="overflow-x-auto">
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
}
