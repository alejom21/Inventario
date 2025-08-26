import { supabase } from "../lib/supabaseClient";
import { Product } from "../data/types";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data as Product[];
}

export async function saveProduct(product: Product) {
  const { data, error } = await supabase.from("products").insert([product]);
  if (error) throw error;
  return data;
}

export async function updateProductStock(productId: string, sizes: { size: string; stock: number }[]) {
  const { data, error } = await supabase
    .from("products")
    .update({ sizes })
    .eq("id", productId);
  if (error) throw error;
  return data;
}

export async function updateProduct(product: Product) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", product.id);
  if (error) throw error;
  return data;
}

export async function deleteProduct(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) throw error;
  return data;
}