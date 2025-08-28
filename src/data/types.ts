
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

export type SaleItem = {
  productId: number;
  productName: string; 
  talla: string;
  color: string;
  stock: number;
  price: number;
};

export type Sale = {
  id: number;
  date: string;
  type: "detal" | "mayor";
  items: SaleItem[];
  total: number;
};