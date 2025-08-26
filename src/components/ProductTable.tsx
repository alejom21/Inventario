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
    <div className="border rounded-lg p-4 shadow-sm bg-white overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Lista de Productos</h2>

      <input
        type="text"
        placeholder="Buscar por Ref o Nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
        <div className="flex justify-center" style={{display:"flex", justifyContent: "center"}}>
          <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-2 text-left">Ref</th>
              <th className="border p-2 text-left">Nombre</th>
              {/* <th className="border p-2 text-left">Costo</th> */}
              <th className="border p-2 text-left">Precio Detal</th>
              <th className="border p-2 text-left">Precio Mayor</th>
              <th className="border p-2 text-left">Tallas</th>
              <th className="border p-2 text-left">Acciones</th>
              <th className="border p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              let sizesArr: SizeStock[] = [];
              if (Array.isArray(p.sizes)) sizesArr = p.sizes;
              else if (typeof p.sizes === "string") {
                try { sizesArr = JSON.parse(p.sizes); } 
                catch { sizesArr = []; }
              }

              return (
                <tr
                  key={p.id}
                  className={p.active ? "bg-white hover:bg-gray-50" : "bg-red-50 text-gray-500"}
                >
                  <td className="border p-2">{p.ref}</td>
                  <td className="border p-2">{p.name}</td>
                  {/* <td className="border p-2">${p.cost}</td> */}
                  <td className="border p-2">${p.priceRetail}</td>
                  <td className="border p-2">${p.priceWholesale}</td>
                  <td className="border p-2">
                    {sizesArr.map((s, i) => (
                      <span key={i} className="block">
                        <span className="font-semibold">{s.size}</span>: {s.stock}
                      </span>
                    ))}
                  </td>
                  <td className="border p-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        onEdit(p)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                      className="bg-blue-600 hover:bg-blue-700 text-black px-2 py-1 rounded text-sm transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("¿Eliminar este producto?")) onDelete(p.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-black px-2 py-1 rounded text-sm transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => onToggleActive(p.id)}
                      className={`px-2 py-1 rounded text-sm transition ${
                        p.active ? "bg-gray-400 text-black hover:bg-gray-500" : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {p.active ? "Inhabilitar" : "Habilitar"}
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    {p.active ? "✅ Activo" : "❌ Inhabilitado"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

}
