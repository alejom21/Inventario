import { Product } from './data/types';

export const calculateInventoryValue = (products: Product[]) =>
  products.reduce(
    (sum, p) =>
      sum + p.cost * p.sizes.reduce((a, s) => a + s.stock, 0),
    0
  );

export const calculateStockQuantity = (product: Product) =>
  product.sizes.reduce((sum, s) => sum + s.stock, 0);
