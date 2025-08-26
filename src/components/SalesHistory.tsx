import { Sale } from "../app/page"; 

type Props = {
  sales: Sale[];
  onCancel: () => void;
};

export default function SalesHistory({ sales, onCancel }: Props) {
  return (
    <div className="mt-8">
      <h2 className="font-bold mb-2">Historial de Ventas</h2>
      {sales.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Producto</th>
              <th className="border px-2 py-1">Talla</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Total Venta</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="border px-2 py-1">
                  {new Date(sale.date).toLocaleString()}
                </td>
                <td className="border px-2 py-1">{sale.productName}</td>
                <td className="border px-2 py-1">{sale.size}</td>
                <td className="border px-2 py-1">{sale.stock}</td>
                <td className="border px-2 py-1">${sale.price * sale.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
          type="button"
          className="bg-gray-400 text-black px-4 py-1 rounded"
          onClick={onCancel}
        >
          Cerrar Historial
        </button>
    </div>
  );
}