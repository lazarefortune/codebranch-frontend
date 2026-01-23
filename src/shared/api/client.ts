import type { ApiError } from "@/contracts/auth.contract";

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
 */
class ApiClient {
  private baseURL: string;

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
   * Effectue une requête GET
   */
  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(includeAuth),
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Effectue une requête POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    // Gère les réponses 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Effectue une requête PUT
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true,
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
