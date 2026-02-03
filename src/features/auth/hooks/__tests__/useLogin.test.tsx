import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin } from "../useLogin";
import * as authApi from "../../services/auth.api";
import { setAccessToken } from "@/shared/hooks/useAuthState";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock auth service
vi.mock("../../services/auth.api", () => ({
  login: vi.fn(),
}));

// Mock useAuthState
vi.mock("@/shared/hooks/useAuthState", () => ({
  setAccessToken: vi.fn(),
}));

describe("useLogin", () => {
  let queryClient: QueryClient;
  let mockRouter: { push: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mockRouter = { push: vi.fn() };
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
    vi.clearAllMocks();
  });

  it("devrait appeler login, stocker le token et rediriger", async () => {
    const mockResponse = {
      accessToken: "jwt_token_123",
      user: {
        id: "usr_123",
        email: "test@example.com",
        emailVerifiedAt: "2026-01-15T18:05:00.000Z",
        createdAt: "2026-01-15T18:00:00.000Z",
        updatedAt: "2026-01-15T18:05:00.000Z",
      },
    };

    (authApi.login as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      email: "test@example.com",
      password: "StrongPass123!",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(authApi.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "StrongPass123!",
    });
    expect(setAccessToken).toHaveBeenCalledWith("jwt_token_123");
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("devrait gérer les erreurs", async () => {
    const mockError = new Error("Identifiants invalides");
    (authApi.login as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLogin(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      email: "test@example.com",
      password: "WrongPassword",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(setAccessToken).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
