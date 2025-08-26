import { useState, useEffect } from "react";
import { Product } from "../data/types";
import { Sale } from "../app/page";

type Props = {
  products: Product[];
  onSale: (sale: Omit<Sale, "id" | "date" | "productName">) => void;
  onCancel: () => void; 
};

export default function SalesForm({ products, onSale, onCancel }: Props) {
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState(1);
  const [priceType, setPriceType] = useState<"retail" | "wholesale">("retail");
  const [price, setPrice] = useState(0);

  const selectedProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    if (selectedProduct) {
      setPrice(
        priceType === "retail"
          ? selectedProduct.priceRetail
          : selectedProduct.priceWholesale
      );
    } else {
      setPrice(0);
    }
  }, [selectedProduct, priceType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !size || stock <= 0) return;
    onSale({
      productId,
      size,
      stock,
      price,
    });
    setProductId("");
    setSize("");
    setStock(1);
    setPriceType("retail");
    setPrice(0);
  };

  const total = stock * price;

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h2 className="font-bold mb-2">Registrar Venta</h2>
      <div className="mb-2">
        <label className="block mb-1">Producto</label>
        <select
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setSize("");
            setPriceType("retail");
          }}
          className="border p-1"
        >
          <option value="">Selecciona producto</option>
          {products
            .filter((p) => p.active)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>
      {selectedProduct && (
        <>
          <div className="mb-2">
            <label className="block mb-1">Talla</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border p-1"
            >
              <option value="">Selecciona talla</option>
              {selectedProduct.sizes.map((s) =>
                s.stock > 0 ? (
                  <option key={s.size} value={s.size}>
                    {s.size} (Stock: {s.stock})
                  </option>
                ) : null
              )}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Tipo de precio</label>
            <select
              value={priceType}
              onChange={(e) =>
                setPriceType(e.target.value as "retail" | "wholesale")
              }
              className="border p-1"
            >
              <option value="retail">Detalle (${selectedProduct.priceRetail})</option>
              <option value="wholesale">Mayorista (${selectedProduct.priceWholesale})</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Cantidad</label>
            <input
              type="number"
              min={1}
              max={
                selectedProduct.sizes.find((s) => s.size === size)?.stock || 1
              }
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="border p-1 w-20"
              placeholder="Cantidad"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Precio unitario</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border p-1 w-24"
              placeholder="Precio venta"
            />
          </div>
          <div className="mb-2 font-bold">
            Total: ${isNaN(total) ? 0 : total}
          </div>
        </>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-black px-4 py-1 rounded"
        disabled={!productId || !size || stock <= 0}
      >
        Vender
      </button>
      <button
          type="button"
          className="bg-gray-400 text-black px-4 py-1 rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>
    </form>
  );
}