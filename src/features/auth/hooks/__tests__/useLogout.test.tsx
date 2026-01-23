import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogout } from "../useLogout";
import * as authApi from "../../services/auth.api";
import { clearAuth } from "@/shared/hooks/useAuthState";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock auth service
vi.mock("../../services/auth.api", () => ({
  logout: vi.fn(),
}));

// Mock useAuthState
vi.mock("@/shared/hooks/useAuthState", () => ({
  clearAuth: vi.fn(),
}));

describe("useLogout", () => {
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

  it("devrait appeler logout, nettoyer l'état et rediriger", async () => {
    (authApi.logout as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(authApi.logout).toHaveBeenCalled();
    expect(clearAuth).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/connexion");
  });

  it("devrait nettoyer l'état même en cas d'erreur", async () => {
    const mockError = new Error("Erreur serveur");
    (authApi.logout as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLogout(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Même en cas d'erreur, on nettoie l'état local
    expect(clearAuth).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/connexion");
  });
});
