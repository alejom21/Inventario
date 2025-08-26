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
    setSizes((prev) => [...prev, { size: "", stock: 0 }]);
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
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
      <h2 className="text-lg font-semibold mb-3">
        {editingProduct ? "✏️ Editar Producto" : "➕ Agregar Producto"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-medium mb-1">Referencia</label>
          <input
            name="ref"
            placeholder="Referencia"
            value={formData.ref}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Costo</label>
          <input
            type="number"
            name="cost"
            placeholder="Costo"
            value={formData.cost}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Precio Detal</label>
          <input
            type="number"
            name="priceRetail"
            placeholder="Precio Detal"
            value={formData.priceRetail}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Precio Mayor</label>
          <input
            type="number"
            name="priceWholesale"
            placeholder="Precio Mayor"
            value={formData.priceWholesale}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Tallas</h3>
        {sizes.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <div>
              <label className="block text-xs mb-1">Talla</label>
              <input
                placeholder="Talla"
                value={s.size}
                onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={s.stock}
                onChange={(e) => handleSizeChange(i, "stock", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addSize} className="text-sm text-blue-600">
          ➕ Agregar talla
        </button>
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {editingProduct ? "Guardar Cambios" : "Agregar Producto"}
      </button>
      <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cerrar Formularo
        </button>
    </form>
  );
}