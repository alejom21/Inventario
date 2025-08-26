"use client";
import { useState } from "react";
import { Product, SizeStock } from "../data/types"; 

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ProductTable({ products, onEdit, onToggleActive, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const filteredProducts = products.filter(
    (p) =>
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log("Productos filtrados:", filteredProducts);
  filteredProducts.forEach(p => {
    console.log("Producto:", p.name, "sizes:", p.sizes);
  });
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-3">📋 Lista de Productos</h2>

      <input
        type="text"
        placeholder="Buscar por Ref o Nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 border p-2 rounded w-full"
      />

      <table className="w-full border-collapse">
        
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Ref</th>
            <th className="border p-2">Nombre</th>{/* 
            <th className="border p-2">Costo</th> */}
            <th className="border p-2">Precio Detal</th>
            <th className="border p-2">Precio Mayor</th>
            <th className="border p-2">Tallas</th>
            <th className="border p-2">Acciones</th>
            <th className="border p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr
              key={p.id}
              className={p.active ? "bg-black" : "bg-red-100 text-gray-500"}
            >
              <td className="border p-2">{p.ref}</td>
              <td className="border p-2">{p.name}</td>{/* 
              <td className="border p-2">${p.cost}</td> */}
              <td className="border p-2">${p.priceRetail}</td>
              <td className="border p-2">${p.priceWholesale}</td>
              <td className="border p-2">
                {(() => {
                  let sizesArr: SizeStock[] = [];
                  if (Array.isArray(p.sizes)) {
                    sizesArr = p.sizes;
                  } else if (typeof p.sizes === "string") {
                    try {
                      sizesArr = JSON.parse(p.sizes);
                    } catch {
                      sizesArr = [];
                    }
                  }
                  return sizesArr.map((s, i) => (
                    <span key={i}>
                      <span className="font-semibold">{s.size}</span>: {s.stock}
                      <br />
                    </span>
                  ));
                })()}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="bg-blue-600 text-black px-2 py-1 rounded text-sm"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("¿Eliminar este producto?")) onDelete(p.id);
                  }}
                  className="bg-blue-600 text-black px-2 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => onToggleActive(p.id)}
                  className={`px-2 py-1 rounded text-sm ${
                    p.active ? "bg-red-600 text-black" : "bg-green-600 text-black"
                  }`}
                >
                  {p.active ? "Inhabilitar" : "Habilitar"}
                </button>
              </td>
              <td className="border p-2">
                {p.active ? "✅ Activo" : "❌ Inhabilitado"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
