import { useState } from "react";
import { Sale } from "../data/types";

type Props = {
  sales: Sale[];
  onCancel: () => void;
};

export default function SalesHistory({ sales, onCancel }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saleChannel, setSaleChannel] = useState<"" | "fisico" | "virtual">("");

  // Filtrado por rango de fechas y canal de venta
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date).getTime();
    const from = startDate ? new Date(startDate).getTime() : null;
    const to = endDate ? new Date(endDate).getTime() : null;

    if (from && saleDate < from) return false;
    if (to && saleDate > to) return false;
    if (saleChannel && sale.saleChannel !== saleChannel) return false; // filtro por canal
    return true;
  });

  // Calcular total de las ventas filtradas
  const totalVentas = filteredSales.reduce(
    (acc, sale) =>
      acc + sale.items.reduce((sum, item) => sum + item.price * item.stock, 0),
    0
  );

  return (
    <div className="mt-8 border rounded-lg p-4 shadow-sm bg-white overflow-x-auto max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">🧾 Historial de Ventas</h2>

      {/* Filtros por fecha y canal */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Canal de venta</label>
          <select
            value={saleChannel}
            onChange={(e) => setSaleChannel(e.target.value as "" | "fisico" | "virtual")}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Todos</option>
            <option value="fisico">Local físico</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <button
          type="button"
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setSaleChannel("");
          }}
        >
          Limpiar
        </button>
      </div>

      {filteredSales.length === 0 ? (
        <p className="text-gray-500">No hay ventas registradas en el rango seleccionado.</p>
      ) : (
        <>
          <div className="flex justify-center" style={{ justifyItems: "center" }}>
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2 text-left">Fecha</th>
                  <th className="border p-2 text-left">Producto</th>
                  <th className="border p-2 text-left">Talla</th>
                  <th className="border p-2 text-left">Color</th>
                  <th className="border p-2 text-left">Cantidad</th>
                  <th className="border p-2 text-left">Total</th>
                  <th className="border p-2 text-left">Pago</th>
                  <th className="border p-2 text-left">Canal</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) =>
                  sale.items.map((item, idx) => (
                    <tr key={sale.id + "-" + idx} className="bg-white hover:bg-gray-50">
                      <td className="border p-2">{new Date(sale.date).toLocaleString()}</td>
                      <td className="border p-2">{item.productName}</td>
                      <td className="border p-2">{item.size}</td>
                      <td className="border p-2">{item.color}</td>
                      <td className="border p-2">{item.stock}</td>
                      <td className="border p-2">${item.price * item.stock}</td>
                      <td className="border p-2">{sale.paymentMethod}</td>
                      <td className="border p-2">{sale.saleChannel}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right font-bold text-gray-800 text-lg">
            Total Ventas: ${totalVentas}
          </div>
        </>
      )}

      <div className="mt-4">
        <button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded transition"
          onClick={onCancel}
        >
          Cerrar Historial
        </button>
      </div>
    </div>
  );
}
