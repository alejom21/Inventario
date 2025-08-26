import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import { InventoryProvider } from "@/context/InventoryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestión de Inventario BlueStore",
};

export default function RootLayout({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <html lang="es">      
      <body className={inter.className}>
        <InventoryProvider>
          {children}
        </InventoryProvider>
      </body>
    </html>
  );
}
