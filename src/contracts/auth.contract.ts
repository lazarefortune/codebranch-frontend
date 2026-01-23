/**
 * Types TypeScript basés sur les DTOs du contrat API pour l'authentification
 * @see docs/API_CONTRAT.MD
 */

/**
 * User DTO
 */
export type User = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Register Request
 */
export type RegisterRequest = {
  email: string;
  password: string;
};

/**
 * Register Response
 */
export type RegisterResponse = {
  user: User;
  next: {
    action: "VERIFY_EMAIL_CODE";
  };
};

/**
 * Verify Email Request
 */
export type VerifyEmailRequest = {
  email: string;
  code: string;
};

/**
 * Verify Email Response
 */
export type VerifyEmailResponse = {
  status: "VERIFIED";
  user: User;
};

/**
 * Resend Verification Code Request
 */
export type ResendVerificationCodeRequest = {
  email: string;
};

/**
 * Resend Verification Code Response
 */
export type ResendVerificationCodeResponse = {
  status: "SENT";
};

/**
 * Login Request
 */
export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Login Response
 */
export type LoginResponse = {
  accessToken: string;
  user: User;
};

/**
 * Refresh Response
 */
export type RefreshResponse = {
  accessToken: string;
};

/**
 * Forgot Password Request
 */
export type ForgotPasswordRequest = {
  email: string;
};

/**
 * Forgot Password Response
 */
export type ForgotPasswordResponse = {
  status: "SENT";
};

/**
 * Reset Password Request
 */
export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

/**
 * Reset Password Response
 */
export type ResetPasswordResponse = {
  status: "RESET";
};

/**
 * Get Current User Response
 */
export type GetCurrentUserResponse = {
  user: User;
};

/**
 * API Error Response (format standardisé)
 */
export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
    requestId: string;
  };
};

/**
 * Error codes possibles
 */
export type ErrorCode =
  | "EMAIL_ALREADY_EXISTS"
  | "VALIDATION_ERROR"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "USER_NOT_FOUND"
  | "ALREADY_VERIFIED"
  | "RATE_LIMITED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "INVALID_REFRESH_TOKEN"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST";
