
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

/* export type SaleItem = {
  productId: string;
  productName: string; 
  talla: string;
  color: string;
  stock: number;
  price: number;
}; */
/* export type SaleItem = {
  productId: string;
  productName: string;
  size: string;
  color: string;
  stock: number;
  price: number;
};

export type Sale = {
  id: string;
  date: string;
  items: SaleItem[];
  paymentMethod: "efectivo" | "transferencia";
  saleChannel: "fisico" | "virtual";
}; */

export interface SaleItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  stock: number; // cantidad vendida
  price: number; // precio unitario
}

export interface Sale {
  id: number;
  date: string;
  items: SaleItem[]; // cada venta puede tener múltiples productos
  paymentMethod: "efectivo" | "transferencia";
  saleChannel: "fisico" | "virtual";
}



/* export type Sale = {
  id: number;
  date: string;
  type: "detal" | "mayor";
  items: SaleItem[];
  total: number;
  paymentMethod: "efectivo" | "transferencia"; 
  saleChannel: "fisico" | "virtual";   
}; */

/* export type Sale = {
  id: number;
  productId: string;
  productName: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  date: string;
  paymentMethod: "efectivo" | "transferencia";
  saleChannel: "fisico" | "virtual";
}; */
