import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useResetPassword } from "../useResetPassword";
import * as authApi from "../../services/auth.api";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock auth service
vi.mock("../../services/auth.api", () => ({
  resetPassword: vi.fn(),
}));

describe("useResetPassword", () => {
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

  it("devrait appeler resetPassword et rediriger vers connexion", async () => {
    const mockResponse = { status: "RESET" as const };

    (authApi.resetPassword as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      token: "reset_token_123",
      newPassword: "NewStrongPass123!",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(authApi.resetPassword).toHaveBeenCalledWith({
      token: "reset_token_123",
      newPassword: "NewStrongPass123!",
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/connexion");
  });

  it("devrait gérer les erreurs", async () => {
    const mockError = new Error("Token invalide");
    (authApi.resetPassword as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      token: "invalid_token",
      newPassword: "NewStrongPass123!",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
