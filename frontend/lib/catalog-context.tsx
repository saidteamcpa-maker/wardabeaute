"use client";

import { createContext, useContext } from "react";
import { products as STATIC_PRODUCTS } from "@/content/products";

const CatalogContext = createContext<Record<string, any>>(STATIC_PRODUCTS as Record<string, any>);

export function CatalogProvider({ catalog, children }: { catalog: Record<string, any>; children: React.ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext) as Record<string, any>;
}
