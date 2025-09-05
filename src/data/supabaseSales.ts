import { supabase } from "../lib/supabaseClient";
import { Sale } from "../data/types"; 

/* export async function saveSale(sale: Sale) {
  const { data, error } = await supabase.from("sales").insert([sale]);
  if (error) throw error;
  return data;
} */

export async function saveSale(sale: Sale) {
  const { data, error } = await supabase
    .from("sales")
    .insert([
      {
        id: sale.id,
        date: sale.date,
        items: JSON.stringify(sale.items ?? []), 
        paymentMethod: sale.paymentMethod,
        saleChannel: sale.saleChannel,
      },
    ]);

  if (error) throw error;
  return data;
}


export async function fetchSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data as any[]).map((s) => ({
    ...s,
    items: s.items ? JSON.parse(s.items) : [],
  }));
}

/* export async function fetchSales(): Promise<Sale[]> {
  const { data, error } = await supabase.from("sales").select("*");
  if (error) throw error;
  return data as Sale[];
} */

/* export async function deleteSale(saleId: string) {
  const { data, error } = await supabase
    .from("sales")
    .delete()
    .eq("id", saleId);
  if (error) throw error;
  return data;
} */

