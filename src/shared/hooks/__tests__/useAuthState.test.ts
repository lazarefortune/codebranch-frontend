import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  isAuthenticated,
  clearAuth,
} from "../useAuthState";

describe("useAuthState", () => {
  let localStorageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  describe("getAccessToken", () => {
    it("devrait retourner le token depuis localStorage", () => {
      localStorageMock.getItem.mockReturnValue("test-token");

      const token = getAccessToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("accessToken");
      expect(token).toBe("test-token");
    });

    it("devrait retourner null si aucun token n'est stocké", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const token = getAccessToken();

      expect(token).toBeNull();
    });

    it("devrait retourner null si window est undefined (SSR)", () => {
      const originalWindow = global.window;
      // @ts-expect-error - On simule l'absence de window
      delete global.window;

      const token = getAccessToken();

      expect(token).toBeNull();

      global.window = originalWindow;
    });
  });

  describe("setAccessToken", () => {
    it("devrait stocker le token dans localStorage", () => {
      setAccessToken("new-token");

      expect(localStorageMock.setItem).toHaveBeenCalledWith("accessToken", "new-token");
    });
  });

  describe("clearAccessToken", () => {
    it("devrait supprimer le token de localStorage", () => {
      clearAccessToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("accessToken");
    });
  });

  describe("isAuthenticated", () => {
    it("devrait retourner true si un token existe", () => {
      localStorageMock.getItem.mockReturnValue("test-token");

      expect(isAuthenticated()).toBe(true);
    });

    it("devrait retourner false si aucun token n'existe", () => {
      localStorageMock.getItem.mockReturnValue(null);

      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("clearAuth", () => {
    it("devrait supprimer le token", () => {
      clearAuth();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("accessToken");
    });
  });
});
