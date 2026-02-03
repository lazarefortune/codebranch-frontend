import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useVerifyEmail } from "../useVerifyEmail";
import * as authApi from "../../services/auth.api";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock auth service
vi.mock("../../services/auth.api", () => ({
  verifyEmail: vi.fn(),
}));

describe("useVerifyEmail", () => {
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

  it("devrait appeler verifyEmail et rediriger vers connexion", async () => {
    const mockResponse = {
      status: "VERIFIED" as const,
      user: {
        id: "usr_123",
        email: "test@example.com",
        emailVerifiedAt: "2026-01-15T18:05:00.000Z",
        createdAt: "2026-01-15T18:00:00.000Z",
        updatedAt: "2026-01-15T18:05:00.000Z",
      },
    };

    (authApi.verifyEmail as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      email: "test@example.com",
      code: "123456",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(authApi.verifyEmail).toHaveBeenCalledWith({
      email: "test@example.com",
      code: "123456",
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/connexion");
  });

  it("devrait gérer les erreurs", async () => {
    const mockError = new Error("Code invalide");
    (authApi.verifyEmail as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      email: "test@example.com",
      code: "000000",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
