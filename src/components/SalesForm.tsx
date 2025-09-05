import { useState, useEffect } from "react";
import { SaleItem, Product } from "../data/types";

type Props = {
  products: Product[];
  onSale: (
    saleItems: SaleItem[],
    paymentMethod: "efectivo" | "transferencia",
    saleChannel: "fisico" | "virtual"
  ) => Promise<void> | void;
  onCancel: () => void;
};

export default function SalesForm({ products, onSale, onCancel }: Props) {
  const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState(1);
  const [priceType, setPriceType] = useState<"retail" | "wholesale">("retail");
  const [price, setPrice] = useState(0);

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
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

  // Agregar producto al carrito
  const handleAddItem = () => {
    if (!selectedProduct || !size || !color || stock <= 0) return;

    const availableStock = selectedProduct.sizes.find(
      (s) => s.size === size && s.color === color
    )?.stock;

    if (!availableStock || stock > availableStock) {
      alert(`❌ La cantidad excede el stock disponible (${availableStock})`);
      return;
    }

    const newItem: SaleItem = {
      productId,
      productName: selectedProduct.name,
      size,
      color,
      stock,
      price,
    };

    setSaleItems((prev) => [...prev, newItem]);

    // Limpiar selección
    setProductId("");
    setProductSearch("");
    setSize("");
    setColor("");
    setStock(1);
    setPriceType("retail");
    setPrice(0);
  };

  const handleConfirmSale = () => {
    if (saleItems.length === 0) return;
    onSale(saleItems, paymentMethod, saleChannel);
    setSaleItems([]); // limpiar carrito
  };

  const total = saleItems.reduce((acc, item) => acc + item.price * item.stock, 0);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">🛒 Registrar Venta</h2>

      {/* Buscador de producto */}
      <div className="mb-4 relative">
        <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Producto</label>
        <input
          type="text"
          placeholder="Escribe nombre o referencia"
          value={productId ? selectedProduct?.name || "" : productSearch}
          onChange={(e) => {
            setProductSearch(e.target.value);
            setProductId("");
            setSize("");
            setColor("");
            setPriceType("retail");
          }}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {productSearch && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-48 overflow-y-auto mt-1 rounded shadow">
            {products
              .filter(
                (p) =>
                  p.active &&
                  (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    (p.ref || "").toLowerCase().includes(productSearch.toLowerCase()))
              )
              .map((p) => (
                <li
                  key={p.id}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setProductId(p.id);
                    setProductSearch("");
                  }}
                >
                  {p.name} {p.ref ? `(${p.ref})` : ""}
                </li>
              ))}
          </ul>
        )}
      </div>

      {selectedProduct && (
        <>
          {/* Talla */}
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

          {/* Color */}
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

          {/* Tipo de precio */}
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

          {/* Cantidad */}
          <div className="mb-4">
            <label className="block text-sm p-2 font-medium text-gray-600 mb-1">Cantidad</label>
            <input
              type="number"
              min={1}
              max={selectedProduct.sizes.find((s) => s.size === size && s.color === color)?.stock || 1}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded w-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Cantidad"
            />
          </div>

          {/* Precio */}
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

          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded transition mb-4"
            onClick={handleAddItem}
            disabled={!productId || !size || !color || stock <= 0}
          >
            ➕ Agregar producto
          </button>
        </>
      )}

      {/* Carrito */}
      {saleItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">🧺 Productos en esta venta:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {saleItems.map((item, idx) => (
              <li key={idx}>
                {item.productName} - {item.size}/{item.color} - {item.stock} x ${item.price} = ${item.stock * item.price}
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold">Total: ${total}</div>
        </div>
      )}

      {/* Forma de pago */}
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

      {/* Canal de venta */}
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

      {/* Botones */}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded transition disabled:opacity-50"
          disabled={saleItems.length === 0}
          onClick={handleConfirmSale}
        >
          ✅ Confirmar Venta
        </button>
        <button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded transition"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
