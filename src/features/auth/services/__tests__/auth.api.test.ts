import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authApi from "../auth.api";
import { apiClient } from "@/shared/api/client";

// Mock du client API
vi.mock("@/shared/api/client", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("auth.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = {
        user: {
          id: "usr_123",
          email: "test@example.com",
          emailVerifiedAt: null,
          createdAt: "2026-01-15T18:00:00.000Z",
          updatedAt: "2026-01-15T18:00:00.000Z",
        },
        next: { action: "VERIFY_EMAIL_CODE" },
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.register({
        email: "test@example.com",
        password: "StrongPass123!",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/register",
        { email: "test@example.com", password: "StrongPass123!" },
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("verifyEmail", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = {
        status: "VERIFIED",
        user: {
          id: "usr_123",
          email: "test@example.com",
          emailVerifiedAt: "2026-01-15T18:05:00.000Z",
          createdAt: "2026-01-15T18:00:00.000Z",
          updatedAt: "2026-01-15T18:05:00.000Z",
        },
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.verifyEmail({
        email: "test@example.com",
        code: "123456",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/verify-email",
        { email: "test@example.com", code: "123456" },
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resendVerificationCode", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = { status: "SENT" };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.resendVerificationCode({
        email: "test@example.com",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/resend-verification-code",
        { email: "test@example.com" },
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("login", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = {
        accessToken: "jwt_token",
        user: {
          id: "usr_123",
          email: "test@example.com",
          emailVerifiedAt: "2026-01-15T18:05:00.000Z",
          createdAt: "2026-01-15T18:00:00.000Z",
          updatedAt: "2026-01-15T18:05:00.000Z",
        },
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.login({
        email: "test@example.com",
        password: "StrongPass123!",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/login",
        { email: "test@example.com", password: "StrongPass123!" },
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("refreshToken", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = { accessToken: "new_jwt_token" };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.refreshToken();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/refresh",
        undefined,
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("logout", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/logout",
        undefined,
        true
      );
    });
  });

  describe("forgotPassword", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = { status: "SENT" };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.forgotPassword({
        email: "test@example.com",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/password/forgot",
        { email: "test@example.com" },
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resetPassword", () => {
    it("devrait appeler apiClient.post avec les bons paramètres", async () => {
      const mockResponse = { status: "RESET" };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.resetPassword({
        token: "reset_token",
        newPassword: "NewStrongPass123!",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/password/reset",
        { token: "reset_token", newPassword: "NewStrongPass123!" },
        false
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getCurrentUser", () => {
    it("devrait appeler apiClient.get avec les bons paramètres", async () => {
      const mockResponse = {
        user: {
          id: "usr_123",
          email: "test@example.com",
          emailVerifiedAt: "2026-01-15T18:05:00.000Z",
          createdAt: "2026-01-15T18:00:00.000Z",
          updatedAt: "2026-01-15T18:05:00.000Z",
        },
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authApi.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith("/me", true);
      expect(result).toEqual(mockResponse);
    });
  });
});
