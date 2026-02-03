import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RegisterForm } from "../RegisterForm";
import * as useRegisterHook from "../../hooks/useRegister";

// Mock useRegister
vi.mock("../../hooks/useRegister", () => ({
  useRegister: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("RegisterForm", () => {
  let queryClient: QueryClient;
  let mockMutate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mockMutate = vi.fn();
    (useRegisterHook.useRegister as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });
  });

  it("devrait rendre le formulaire avec tous les champs", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmer le mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it("devrait afficher les erreurs de validation", async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
    });
  });

  it("devrait appeler mutate avec les bonnes données lors de la soumission", async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Mot de passe"), "StrongPass123!");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "StrongPass123!");

    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "StrongPass123!",
      });
    });
  });

  it("devrait afficher un état de chargement", () => {
    (useRegisterHook.useRegister as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });
    expect(submitButton).toBeDisabled();
  });
});
