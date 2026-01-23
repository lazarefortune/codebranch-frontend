"use client";

import { useEffect } from "react";

/**
 * Composant pour initialiser MSW en développement uniquement
 * Doit être utilisé dans le layout principal
 */
export function InitMSW() {
  useEffect(() => {
    // Initialiser MSW uniquement en développement et côté client
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      import("./browser").then(({ worker }) => {
        worker
          .start({
            onUnhandledRequest: "bypass",
            serviceWorker: {
              url: "/mockServiceWorker.js",
            },
            // Permettre l'interception des requêtes cross-origin
            quiet: false,
          })
          .then(() => {
            console.log("[MSW] Service Worker démarré avec succès");
          })
          .catch((error) => {
            console.error("Erreur lors de l'initialisation de MSW:", error);
          });
      });
    }
  }, []);

  // Ne rien rendre, c'est juste pour l'initialisation
  return null;
}
