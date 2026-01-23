"use client";

import { useEffect } from "react";

/**
 * Composant pour initialiser le mock fetch en développement uniquement
 * Doit être utilisé dans le layout principal
 * 
 * Mode contrôlé par NEXT_PUBLIC_API_MODE:
 * - "mock" : Utilise le mock fetch (par défaut en développement)
 * - "api" : Utilise l'API réelle via le proxy Next.js
 */
export function InitFetchMock() {
  useEffect(() => {
    // Initialiser le mock uniquement en développement et côté client
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      const apiMode = process.env.NEXT_PUBLIC_API_MODE || "mock";

      if (apiMode === "mock") {
        import("./fetch-mock").then(({ setupFetchMock }) => {
          setupFetchMock();
          console.log("[MOCK] Mock fetch activé - Mode:", apiMode);
        });
      } else {
        console.log("[API] Mode API réelle activé - Mode:", apiMode);
      }
    }
  }, []);

  // Ne rien rendre, c'est juste pour l'initialisation
  return null;
}
