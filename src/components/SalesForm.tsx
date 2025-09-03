import { useState, useEffect } from "react";
import { Sale, Product } from "../data/types";

/* type Props = {
  products: Product[];
  onSale: (sale: Omit<Sale, "id" | "date" | "productName">) => void;
  onCancel: () => void; 
}; */

type Props = {
  products: Product[];
  onSale: (sale: Omit<Sale, "id" | "date">) => Promise<void> | void;
  onCancel: () => void; 
};


export default function SalesForm({ products, onSale, onCancel }: Props) {
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState(1);
  const [priceType, setPriceType] = useState<"retail" | "wholesale">("retail");
  const [price, setPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "transferencia">("efectivo");
  const [saleChannel, setSaleChannel] = useState<"fisico" | "virtual">("fisico");


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

/*   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !size || stock <= 0) return;
    onSale({
      productId,
      size,
      color,
      stock,
      price,
      paymentMethod,
      saleChannel,
    });
    setProductId("");
    setSize("");
    setStock(1);
    setPriceType("retail");
    setPrice(0);  
    setPaymentMethod("efectivo");
    setSaleChannel("fisico");
  }; */

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!productId || !size || !color || stock <= 0) return;

  onSale({
    productId,
    productName: selectedProduct?.name || "",
    size,
    color,
    stock,
    price,
    paymentMethod,
    saleChannel,
  });

  // Reset
  setProductId("");
  setSize("");
  setColor("");
  setStock(1);
  setPriceType("retail");
  setPrice(0);
  setPaymentMethod("efectivo");
  setSaleChannel("fisico");
};


  const total = stock * price;

  {return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 shadow-sm bg-white max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">🛒 Registrar Venta</h2>

      <div className="mb-4">
        <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Producto</label>
        <select
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setSize("");
            setColor("");
            setPriceType("retail");
          }}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Talla</label>
            <select
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setColor("");
              }}
              className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecciona talla</option>
              {[...new Set(selectedProduct.sizes.map((s) => s.size))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {size && (
            <div className="mb-4">
              <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecciona color</option>
                {selectedProduct.sizes
                  .filter((s) => s.size === size && s.stock > 0)
                  .map((s, i) => (
                    <option key={i} value={s.color}>
                      {s.color} (Stock: {s.stock})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Tipo de precio</label>
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value as "retail" | "wholesale")}
              className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="retail">Detalle (${selectedProduct.priceRetail})</option>
              <option value="wholesale">Mayorista (${selectedProduct.priceWholesale})</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Cantidad</label>
            <input
              type="number"
              min={1}
              max={
                selectedProduct.sizes.find((s) => s.size === size && s.color === color)?.stock || 1
              }
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded w-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Cantidad"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Precio unitario</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Precio venta"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Forma de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as "efectivo" | "transferencia")}
              className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Canal de Venta</label>
            <select
              value={saleChannel}
              onChange={(e) => setSaleChannel(e.target.value as "fisico" | "virtual")}
              className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="fisico">Local físico</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
          <div className="mb-4 font-semibold text-gray-700">
            Total: ${isNaN(total) ? 0 : total}
          </div>
        </>
      )}

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded transition disabled:opacity-50"
          disabled={!productId || !size || !color || stock <= 0}
        >
          Vender
        </button>
        <button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded transition"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  )}
}