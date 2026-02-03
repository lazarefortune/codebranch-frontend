import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient, ApiClientError } from "../client";

// Mock fetch global
global.fetch = vi.fn();

describe("ApiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("get", () => {
    it("devrait effectuer une requête GET réussie", async () => {
      const mockData = { id: "1", name: "Test" };
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiClient.get("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("devrait inclure le token d'authentification si présent", async () => {
      const mockData = { id: "1" };
      (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("test-token");
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      await apiClient.get("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });

    it("devrait gérer les erreurs API", async () => {
      const errorResponse = {
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
          requestId: "req_123",
        },
      };
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      });

      await expect(apiClient.get("/test")).rejects.toThrow(ApiClientError);
      
      // Réinitialiser le mock pour le deuxième test
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      });
      
      await expect(apiClient.get("/test")).rejects.toThrow("Resource not found");
    });

    it("devrait gérer les réponses 204 No Content", async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => {},
      });

      const result = await apiClient.get("/test");
      expect(result).toBeUndefined();
    });
  });

  describe("post", () => {
    it("devrait effectuer une requête POST avec des données", async () => {
      const requestData = { email: "test@example.com" };
      const responseData = { id: "1", email: "test@example.com" };
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => responseData,
      });

      const result = await apiClient.post("/test", requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(responseData);
    });

    it("devrait effectuer une requête POST sans données", async () => {
      const responseData = { status: "OK" };
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await apiClient.post("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: undefined,
        })
      );
      expect(result).toEqual(responseData);
    });

    it("devrait gérer les erreurs de validation", async () => {
      const errorResponse = {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: [
            { field: "email", message: "Email is required" },
          ],
          requestId: "req_123",
        },
      };
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      });

      try {
        await apiClient.post("/test", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        if (error instanceof ApiClientError) {
          expect(error.code).toBe("VALIDATION_ERROR");
          expect(error.details).toEqual([
            { field: "email", message: "Email is required" },
          ]);
        }
      }
    });
  });

  describe("put", () => {
    it("devrait effectuer une requête PUT", async () => {
      const requestData = { name: "Updated" };
      const responseData = { id: "1", name: "Updated" };
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await apiClient.put("/test/1", requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(responseData);
    });
  });

  describe("delete", () => {
    it("devrait effectuer une requête DELETE", async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => {},
      });

      const result = await apiClient.delete("/test/1");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result).toBeUndefined();
    });
  });

  describe("ApiClientError", () => {
    it("devrait créer une erreur avec toutes les propriétés", () => {
      const error = new ApiClientError(
        "TEST_ERROR",
        "Test message",
        400,
        [{ field: "test", message: "Error" }],
        "req_123"
      );

      expect(error.code).toBe("TEST_ERROR");
      expect(error.message).toBe("Test message");
      expect(error.status).toBe(400);
      expect(error.details).toEqual([{ field: "test", message: "Error" }]);
      expect(error.requestId).toBe("req_123");
      expect(error.name).toBe("ApiClientError");
    });
  });
});
