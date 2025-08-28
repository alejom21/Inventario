import { Sale } from "../app/page"; 

type Props = {
  sales: Sale[];
  onCancel: () => void;
};

export default function SalesHistory({ sales, onCancel }: Props) {
  return (
  <div className="mt-8 border rounded-lg p-4 shadow-sm bg-white overflow-x-auto max-w-4xl mx-auto">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">🧾 Historial de Ventas</h2>

    {sales.length === 0 ? (
      <p className="text-gray-500">No hay ventas registradas.</p>
    ) : (
      <div className="flex justify-center" style={{display:"flex", justifyContent: "center"}}>
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-2 text-left">Fecha</th>
              <th className="border p-2 text-left">Producto</th>
              <th className="border p-2 text-left">Talla</th>
              <th className="border p-2 text-left">Color</th>
              <th className="border p-2 text-left">Cantidad</th>
              <th className="border p-2 text-left">Total Venta</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="bg-white hover:bg-gray-50">
                <td className="border p-2">{new Date(sale.date).toLocaleString()}</td>
                <td className="border p-2">{sale.productName}</td>
                <td className="border p-2">{sale.size}</td>
                <td className="border p-2">{sale.color}</td>
                <td className="border p-2">{sale.stock}</td>
                <td className="border p-2">${sale.price * sale.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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