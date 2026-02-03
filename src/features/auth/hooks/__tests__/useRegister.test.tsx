import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRegister } from "../useRegister";
import * as authApi from "../../services/auth.api";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock auth service
vi.mock("../../services/auth.api", () => ({
  register: vi.fn(),
}));

describe("useRegister", () => {
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

  it("devrait appeler register avec les bonnes données", async () => {
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

    (authApi.register as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegister(), {
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

    expect(authApi.register).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "StrongPass123!",
    });
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/verification-email?email=test%40example.com"
    );
  });

  it("devrait gérer les erreurs", async () => {
    const mockError = new Error("Email déjà utilisé");
    (authApi.register as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    const { result } = renderHook(() => useRegister(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    result.current.mutate({
      email: "test@example.com",
      password: "StrongPass123!",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
