import { apiClient } from "@/shared/api/client";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationCodeRequest,
  ResendVerificationCodeResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  GetCurrentUserResponse,
} from "@/contracts/auth.contract";

/**
 * Service API pour l'authentification
 * Toutes les fonctions appellent le client API centralisé
 */

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>("/auth/register", data, false);
}

/**
 * Vérification de l'email avec un code
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  return apiClient.post<VerifyEmailResponse>("/auth/verify-email", data, false);
}

/**
 * Renvoyer le code de vérification
 */
export async function resendVerificationCode(
  data: ResendVerificationCodeRequest
): Promise<ResendVerificationCodeResponse> {
  return apiClient.post<ResendVerificationCodeResponse>(
    "/auth/resend-verification-code",
    data,
    false
  );
}

/**
 * Connexion d'un utilisateur
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", data, false);
}

/**
 * Rafraîchir le token d'accès
 */
export async function refreshToken(): Promise<RefreshResponse> {
  return apiClient.post<RefreshResponse>("/auth/refresh", undefined, false);
}

/**
 * Déconnexion
 */
export async function logout(): Promise<void> {
  return apiClient.post<void>("/auth/logout", undefined, true);
}

/**
 * Demander la réinitialisation du mot de passe
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  return apiClient.post<ForgotPasswordResponse>("/auth/password/forgot", data, false);
}

/**
 * Réinitialiser le mot de passe avec un token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  return apiClient.post<ResetPasswordResponse>("/auth/password/reset", data, false);
}

/**
 * Récupérer l'utilisateur actuel
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  return apiClient.get<GetCurrentUserResponse>("/me", true);
}
