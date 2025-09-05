
export type SizeStock = {
  size: string;
  color: string
  stock: number;
};

export type Product = {
  id: string;
  ref: string;
  name: string;
  cost: number;
  priceRetail: number;
  priceWholesale: number;
  active: boolean; 
  sizes: SizeStock[]; 
  
};

export interface SaleItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  stock: number; 
  price: number;
}

export interface Sale {
  id: number;
  date: string;
  items: SaleItem[]; 
  paymentMethod: "Efectivo" | "Transferencia";
  saleChannel: "Fisico" | "Virtual";
}

