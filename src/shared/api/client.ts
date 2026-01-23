import type { ApiError, RefreshResponse } from "@/contracts/auth.contract";
import { setAccessToken, clearAccessToken } from "@/shared/hooks/useAuthState";

const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return "/api/v1";
  }

  throw new Error(
    "NEXT_PUBLIC_API_URL doit être défini en production. " +
      "Veuillez configurer cette variable d'environnement.",
  );
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: Array<{ field: string; message: string }>,
    public requestId?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Client HTTP centralisé pour toutes les requêtes API
 * Gère automatiquement les cookies (refresh token) et le refresh du token d'accès
 */
class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Récupère le token d'accès depuis localStorage
   */
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  /**
   * Construit les headers pour une requête
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Rafraîchit le token d'accès en utilisant le refresh token (cookie)
   */
  private async refreshAccessToken(): Promise<string> {
    // Si un refresh est déjà en cours, attendre qu'il se termine
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important : envoie les cookies (cb_refresh)
        });

        if (!response.ok) {
          // Le refresh token est invalide ou expiré
          clearAccessToken();
          throw new ApiClientError(
            "INVALID_REFRESH_TOKEN",
            "La session a expiré. Veuillez vous reconnecter.",
            response.status,
          );
        }

        const data: RefreshResponse = await response.json();
        setAccessToken(data.accessToken);
        return data.accessToken;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Gère les erreurs API et les transforme en ApiClientError
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: ApiError | null = null;

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: {
          code: "UNKNOWN_ERROR",
          message: `Erreur ${response.status} : ${response.statusText}`,
          requestId: "",
        },
      };
    }

    const error = errorData?.error || {
      code: "UNKNOWN_ERROR",
      message: `Erreur ${response.status}: ${response.statusText}`,
      requestId: "",
    };

    throw new ApiClientError(
      error.code,
      error.message,
      response.status,
      error.details,
      error.requestId,
    );
  }

  /**
   * Effectue une requête avec gestion automatique du refresh token
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit,
    includeAuth = true,
    retryOn401 = true,
  ): Promise<T> {
    const fetchOptions: RequestInit = {
      ...options,
      credentials: "include", // Important : envoie les cookies (cb_refresh)
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    };

    let response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

    // Si on reçoit une 401 et qu'on a un token, essayer de le refresh
    if (
      response.status === 401 &&
      includeAuth &&
      retryOn401 &&
      this.getAccessToken()
    ) {
      try {
        // Rafraîchir le token
        await this.refreshAccessToken();

        // Réessayer la requête avec le nouveau token
        const retryOptions: RequestInit = {
          ...options,
          credentials: "include",
          headers: {
            ...this.getHeaders(includeAuth),
            ...options.headers,
          },
        };

        response = await fetch(`${this.baseURL}${endpoint}`, retryOptions);
      } catch (refreshError) {
        // Le refresh a échoué, propager l'erreur
        if (refreshError instanceof ApiClientError) {
          throw refreshError;
        }
        // Sinon, continuer avec l'erreur 401 originale
      }
    }

    if (!response.ok) {
      await this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Effectue une requête GET
   */
  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, includeAuth);
  }

  /**
   * Effectue une requête POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth,
    );
  }

  /**
   * Effectue une requête PUT
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth,
    );
  }

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "DELETE",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth,
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
