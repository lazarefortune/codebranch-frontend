import { http, HttpResponse, delay } from "msw";
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
  ApiError,
} from "@/contracts/auth.contract";

// Utiliser une URL relative pour que MSW puisse intercepter les requêtes
// Next.js proxy les requêtes vers le backend, mais MSW les intercepte avant
const API_BASE_URL = "/api/v1";

// Store en mémoire pour simuler la base de données
const users: Map<string, { id: string; email: string; password: string; emailVerifiedAt: string | null; createdAt: string; updatedAt: string }> = new Map();
const verificationCodes: Map<string, { code: string; expiresAt: number }> = new Map();
const resetTokens: Map<string, { token: string; expiresAt: number }> = new Map();
const refreshTokens: Map<string, string> = new Map(); // refreshToken -> userId
const accessTokens: Map<string, string> = new Map(); // accessToken -> userId

// Helper pour générer un ID
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper pour générer un code de vérification
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper pour générer un token
const generateToken = () => `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper pour vérifier si un email existe
const findUserByEmail = (email: string) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

export const handlers = [
  // POST /api/v1/auth/register
  http.post<never, RegisterRequest, RegisterResponse | ApiError>(
    `${API_BASE_URL}/auth/register`,
    async ({ request }) => {
      await delay(500); // Simulation délai réseau

      const body = await request.json();

      // Vérifier si l'email existe déjà
      if (findUserByEmail(body.email)) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "EMAIL_ALREADY_EXISTS",
              message: "Cet email est déjà utilisé",
              requestId: generateId("req"),
            },
          },
          { status: 409 }
        );
      }

      // Créer l'utilisateur
      const userId = generateId("usr");
      const now = new Date().toISOString();
      const user = {
        id: userId,
        email: body.email,
        password: body.password, // En production, ce serait hashé
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      users.set(userId, user);

      // Générer un code de vérification
      const code = generateVerificationCode();
      verificationCodes.set(body.email, {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      // En production, on enverrait un email ici
      console.log(`[MSW] Code de vérification pour ${body.email}: ${code}`);

      return HttpResponse.json<RegisterResponse>(
        {
          user: {
            id: user.id,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          next: {
            action: "VERIFY_EMAIL_CODE",
          },
        },
        { status: 201 }
      );
    }
  ),

  // POST /api/v1/auth/verify-email
  http.post<never, VerifyEmailRequest, VerifyEmailResponse | ApiError>(
    `${API_BASE_URL}/auth/verify-email`,
    async ({ request }) => {
      await delay(500);

      const body = await request.json();
      const user = findUserByEmail(body.email);

      if (!user) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "USER_NOT_FOUND",
              message: "Utilisateur non trouvé",
              requestId: generateId("req"),
            },
          },
          { status: 404 }
        );
      }

      const storedCode = verificationCodes.get(body.email);

      if (!storedCode) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "INVALID_CODE",
              message: "Code invalide",
              requestId: generateId("req"),
            },
          },
          { status: 400 }
        );
      }

      if (storedCode.code !== body.code) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "INVALID_CODE",
              message: "Code invalide",
              requestId: generateId("req"),
            },
          },
          { status: 400 }
        );
      }

      if (Date.now() > storedCode.expiresAt) {
        verificationCodes.delete(body.email);
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "CODE_EXPIRED",
              message: "Le code a expiré",
              requestId: generateId("req"),
            },
          },
          { status: 400 }
        );
      }

      // Marquer l'email comme vérifié
      const now = new Date().toISOString();
      user.emailVerifiedAt = now;
      user.updatedAt = now;
      users.set(user.id, user);
      verificationCodes.delete(body.email);

      return HttpResponse.json<VerifyEmailResponse>(
        {
          status: "VERIFIED",
          user: {
            id: user.id,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        { status: 200 }
      );
    }
  ),

  // POST /api/v1/auth/resend-verification-code
  http.post<never, ResendVerificationCodeRequest, ResendVerificationCodeResponse | ApiError>(
    `${API_BASE_URL}/auth/resend-verification-code`,
    async ({ request }) => {
      await delay(500);

      const body = await request.json();
      const user = findUserByEmail(body.email);

      if (!user) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "USER_NOT_FOUND",
              message: "Utilisateur non trouvé",
              requestId: generateId("req"),
            },
          },
          { status: 404 }
        );
      }

      if (user.emailVerifiedAt) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "ALREADY_VERIFIED",
              message: "L'email est déjà vérifié",
              requestId: generateId("req"),
            },
          },
          { status: 409 }
        );
      }

      // Générer un nouveau code
      const code = generateVerificationCode();
      verificationCodes.set(body.email, {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });

      console.log(`[MSW] Nouveau code de vérification pour ${body.email}: ${code}`);

      return HttpResponse.json<ResendVerificationCodeResponse>(
        {
          status: "SENT",
        },
        { status: 200 }
      );
    }
  ),

  // POST /api/v1/auth/login
  http.post<never, LoginRequest, LoginResponse | ApiError>(
    `${API_BASE_URL}/auth/login`,
    async ({ request }) => {
      await delay(500);

      const body = await request.json();
      const user = findUserByEmail(body.email);

      if (!user || user.password !== body.password) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Email ou mot de passe incorrect",
              requestId: generateId("req"),
            },
          },
          { status: 401 }
        );
      }

      if (!user.emailVerifiedAt) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "EMAIL_NOT_VERIFIED",
              message: "Veuillez vérifier votre email avant de vous connecter",
              requestId: generateId("req"),
            },
          },
          { status: 403 }
        );
      }

      // Générer les tokens
      const accessToken = generateToken();
      const refreshToken = generateToken();
      refreshTokens.set(refreshToken, user.id);
      accessTokens.set(accessToken, user.id); // Stocker l'association token -> userId

      // Simuler le cookie refresh token (en production, c'est géré par le serveur)
      // Ici, on le stocke juste pour les tests

      return HttpResponse.json<LoginResponse>(
        {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `cb_refresh=${refreshToken}; HttpOnly; Path=/; SameSite=Lax`,
          },
        }
      );
    }
  ),

  // POST /api/v1/auth/refresh
  http.post<never, never, RefreshResponse | ApiError>(
    `${API_BASE_URL}/auth/refresh`,
    async ({ request }) => {
      await delay(300);

      const cookies = request.headers.get("Cookie");
      const refreshToken = cookies?.match(/cb_refresh=([^;]+)/)?.[1];

      if (!refreshToken || !refreshTokens.has(refreshToken)) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "INVALID_REFRESH_TOKEN",
              message: "Token de rafraîchissement invalide",
              requestId: generateId("req"),
            },
          },
          { status: 401 }
        );
      }

      const userId = refreshTokens.get(refreshToken);
      if (!userId) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "INVALID_REFRESH_TOKEN",
              message: "Token de rafraîchissement invalide",
              requestId: generateId("req"),
            },
          },
          { status: 401 }
        );
      }

      const newAccessToken = generateToken();
      accessTokens.set(newAccessToken, userId); // Stocker la nouvelle association

      return HttpResponse.json<RefreshResponse>(
        {
          accessToken: newAccessToken,
        },
        { status: 200 }
      );
    }
  ),

  // POST /api/v1/auth/logout
  http.post(`${API_BASE_URL}/auth/logout`, async ({ request }) => {
    await delay(200);

    // Récupérer le token depuis le header pour le supprimer
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token) {
      accessTokens.delete(token);
    }

    // En production, on invaliderait le refresh token côté serveur
    // Ici, on simule juste une réponse 204

    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Set-Cookie": "cb_refresh=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0",
      },
    });
  }),

  // POST /api/v1/auth/password/forgot
  http.post<never, ForgotPasswordRequest, ForgotPasswordResponse>(
    `${API_BASE_URL}/auth/password/forgot`,
    async ({ request }) => {
      await delay(500);

      const body = await request.json();
      const user = findUserByEmail(body.email);

      // Toujours retourner 200 même si l'email n'existe pas (anti-enumeration)
      if (user) {
        const token = generateToken();
        resetTokens.set(token, {
          token,
          expiresAt: Date.now() + 60 * 60 * 1000, // 1 heure
        });

        console.log(`[MSW] Token de réinitialisation pour ${body.email}: ${token}`);
      }

      return HttpResponse.json<ForgotPasswordResponse>(
        {
          status: "SENT",
        },
        { status: 200 }
      );
    }
  ),

  // POST /api/v1/auth/password/reset
  http.post<never, ResetPasswordRequest, ResetPasswordResponse | ApiError>(
    `${API_BASE_URL}/auth/password/reset`,
    async ({ request }) => {
      await delay(500);

      const body = await request.json();
      const storedToken = resetTokens.get(body.token);

      if (!storedToken) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "TOKEN_INVALID",
              message: "Token invalide",
              requestId: generateId("req"),
            },
          },
          { status: 400 }
        );
      }

      if (Date.now() > storedToken.expiresAt) {
        resetTokens.delete(body.token);
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "TOKEN_EXPIRED",
              message: "Le token a expiré",
              requestId: generateId("req"),
            },
          },
          { status: 400 }
        );
      }

      // Trouver l'utilisateur associé au token (simplifié pour le mock)
      // En production, le token contiendrait l'email ou l'ID utilisateur
      // Ici, on simule juste la réussite
      resetTokens.delete(body.token);

      return HttpResponse.json<ResetPasswordResponse>(
        {
          status: "RESET",
        },
        { status: 200 }
      );
    }
  ),

  // GET /api/v1/me
  http.get<never, never, GetCurrentUserResponse | ApiError>(
    `${API_BASE_URL}/me`,
    async ({ request }) => {
      await delay(300);

      const authHeader = request.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Non authentifié",
              requestId: generateId("req"),
            },
          },
          { status: 401 }
        );
      }

      // Vérifier si le token existe et récupérer l'utilisateur associé
      const userId = accessTokens.get(token);

      if (!userId) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Token invalide",
              requestId: generateId("req"),
            },
          },
          { status: 401 }
        );
      }

      // Récupérer l'utilisateur depuis le store
      const user = users.get(userId);

      if (!user) {
        return HttpResponse.json<ApiError>(
          {
            error: {
              code: "USER_NOT_FOUND",
              message: "Utilisateur non trouvé",
              requestId: generateId("req"),
            },
          },
          { status: 404 }
        );
      }

      return HttpResponse.json<GetCurrentUserResponse>(
        {
          user: {
            id: user.id,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        { status: 200 }
      );
    }
  ),
];
