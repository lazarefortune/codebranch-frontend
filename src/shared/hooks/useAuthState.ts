/**
 * Gestion de l'état d'authentification avec localStorage
 * Fournit des fonctions pour gérer le token d'accès et l'état d'authentification
 */

const ACCESS_TOKEN_KEY = "accessToken";

/**
 * Récupère le token d'accès depuis localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Stocke le token d'accès dans localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Supprime le token d'accès de localStorage
 */
export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Vérifie si l'utilisateur est authentifié (a un token)
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

/**
 * Nettoie complètement l'état d'authentification
 */
export function clearAuth(): void {
  clearAccessToken();
}
