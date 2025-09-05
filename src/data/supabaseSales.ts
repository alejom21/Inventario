import { supabase } from "../lib/supabaseClient";
import { Sale, SaleItem } from "../data/types";

export async function saveSale(sale: Sale) {
  const { data, error } = await supabase
    .from("sales")
    .insert([
      {
        id: sale.id,
        date: sale.date,
        items: JSON.stringify(sale.items), 
        paymentMethod: sale.paymentMethod,
        saleChannel: sale.saleChannel,
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function fetchSales(): Promise<Sale[]> {
  const { data, error } = await supabase.from("sales").select("*");
  if (error) {
    throw new Error(error.message); 
  }

  return (data as Sale[]).map((s) => ({
    ...s,
    items: s.items ? (JSON.parse(String(s.items)) as SaleItem[]) : [],
  })) as Sale[];
}
