"use client";
import { useEffect, useState } from "react";
import { Product, SizeStock } from "../data/types";

type Props = {
  onSave: (product: Product) => void;
  editingProduct: Product | null;
  onCancel: () => void; 
};

export default function ProductForm({ onSave, editingProduct, onCancel }: Props) {
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    cost: 0,
    priceRetail: 0,
    priceWholesale: 0,
  });
  const [sizes, setSizes] = useState<SizeStock[]>([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ref: editingProduct.ref,
        name: editingProduct.name,
        cost: editingProduct.cost,
        priceRetail: editingProduct.priceRetail,
        priceWholesale: editingProduct.priceWholesale,
      });
      setSizes(editingProduct.sizes);
    }
  }, [editingProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" || name.includes("price") ? Number(value) : value,
    }));
  };

  const handleSizeChange = (index: number, key: string, value: string) => {
    setSizes((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              [key]: key === "stock" ? Number(value) : value,
            }
          : s
      )
    );
  };

  const addSize = () => {
    setSizes((prev) => [...prev, { size: "", color: "", stock: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      ref: formData.ref,
      name: formData.name,
      cost: formData.cost,
      priceRetail: formData.priceRetail,
      priceWholesale: formData.priceWholesale,
      sizes,
      active: editingProduct ? editingProduct.active : true,
    };
    onSave(newProduct);
    setFormData({ ref: "", name: "", cost: 0, priceRetail: 0, priceWholesale: 0 });
    setSizes([]);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mb-6 border border-gray-200 p-6 rounded-lg shadow-sm bg-white max-w-3xl mx-auto"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
        {editingProduct ? "✏️ Editar Producto" : "➕ Agregar Producto"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 p-2 text-gray-600">Referencia</label>
          <input
            name="ref"
            placeholder="Referencia"
            value={formData.ref}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 p-2 text-gray-600">Nombre</label>
          <input
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 p-2 text-gray-600">Costo</label>
          <input
            type="number"
            name="cost"
            placeholder="Costo"
            value={formData.cost}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 p-2 text-gray-600">Precio Detal</label>
          <input
            type="number"
            name="priceRetail"
            placeholder="Precio Detal"
            value={formData.priceRetail}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 p-2 text-gray-600">Precio Mayor</label>
          <input
            type="number"
            name="priceWholesale"
            placeholder="Precio Mayor"
            value={formData.priceWholesale}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
      </div>

      <div className="mt-6"> 
        <h3 className="font-semibold mb-3 p-2 text-gray-700">Tallas</h3>
        {sizes.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-xs mb-1 p-2 text-gray-600">Talla</label>
              <input
                placeholder="Talla"
                value={s.size}
                onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1 p-2 text-gray-600">Color</label>
              <input
                placeholder="Color"
                value={s.color}
                onChange={(e) => handleSizeChange(i, "color", e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1 p-2 text-gray-600">Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={s.stock}
                onChange={(e) => handleSizeChange(i, "stock", e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addSize}
          className="text-sm p-2 text-blue-600 hover:underline"
        >
          ➕ Agregar talla
        </button>
      </div>

      <div className="mt-6 flex flex-col p-2 sm:flex-row gap-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-black font-semibold px-4 py-2 m-2 rounded shadow transition"
        >
          {editingProduct ? "Guardar Cambios" : "Agregar Producto"}
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-400 hover:bg-gray-500 text-black font-semibold px-4 py-2 rounded shadow transition"
          onClick={onCancel}
        >
          Cerrar Formulario
        </button>
      </div>
    </form>
  );
}