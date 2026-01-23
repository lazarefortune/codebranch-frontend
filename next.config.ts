import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Proxy les requêtes API vers le backend
  // En mode "mock", le mock fetch intercepte les requêtes avant qu'elles n'atteignent le proxy
  // En mode "api", les requêtes passent par le proxy vers le backend réel
  async rewrites() {
    // Toujours configurer le proxy pour /api/v1
    // Le mock intercepte en premier si activé, sinon les requêtes passent par le proxy
    return [
      {
        source: "/api/v1/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : "http://localhost:4000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
