/**
 * Mock fetch direct pour le développement
 * Intercepte fetch globalement sans service worker
 * Plus simple et plus fiable que MSW pour le développement
 */

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

// Helper pour simuler un délai réseau
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper pour créer une réponse JSON
const createResponse = <T>(data: T, status: number = 200, headers?: HeadersInit): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};

// Helper pour créer une réponse vide (204)
const createEmptyResponse = (headers?: HeadersInit): Response => {
  return new Response(null, {
    status: 204,
    headers,
  });
};

// Handlers pour chaque endpoint
const handleRegister = async (body: RegisterRequest): Promise<Response> => {
  await delay(500);

  if (findUserByEmail(body.email)) {
    return createResponse<ApiError>(
      {
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "Cet email est déjà utilisé",
          requestId: generateId("req"),
        },
      },
      409
    );
  }

  const userId = generateId("usr");
  const now = new Date().toISOString();
  const user = {
    id: userId,
    email: body.email,
    password: body.password,
    emailVerifiedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  users.set(userId, user);

  const code = generateVerificationCode();
  verificationCodes.set(body.email, {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  console.log(`[MOCK] Code de vérification pour ${body.email}: ${code}`);

  return createResponse<RegisterResponse>(
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
    201
  );
};

const handleVerifyEmail = async (body: VerifyEmailRequest): Promise<Response> => {
  await delay(500);

  const user = findUserByEmail(body.email);

  if (!user) {
    return createResponse<ApiError>(
      {
        error: {
          code: "USER_NOT_FOUND",
          message: "Utilisateur non trouvé",
          requestId: generateId("req"),
        },
      },
      404
    );
  }

  const storedCode = verificationCodes.get(body.email);

  if (!storedCode || storedCode.code !== body.code) {
    return createResponse<ApiError>(
      {
        error: {
          code: "INVALID_CODE",
          message: "Code invalide",
          requestId: generateId("req"),
        },
      },
      400
    );
  }

  if (Date.now() > storedCode.expiresAt) {
    verificationCodes.delete(body.email);
    return createResponse<ApiError>(
      {
        error: {
          code: "CODE_EXPIRED",
          message: "Le code a expiré",
          requestId: generateId("req"),
        },
      },
      400
    );
  }

  const now = new Date().toISOString();
  user.emailVerifiedAt = now;
  user.updatedAt = now;
  users.set(user.id, user);
  verificationCodes.delete(body.email);

  return createResponse<VerifyEmailResponse>(
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
    200
  );
};

const handleResendVerificationCode = async (body: ResendVerificationCodeRequest): Promise<Response> => {
  await delay(500);

  const user = findUserByEmail(body.email);

  if (!user) {
    return createResponse<ApiError>(
      {
        error: {
          code: "USER_NOT_FOUND",
          message: "Utilisateur non trouvé",
          requestId: generateId("req"),
        },
      },
      404
    );
  }

  if (user.emailVerifiedAt) {
    return createResponse<ApiError>(
      {
        error: {
          code: "ALREADY_VERIFIED",
          message: "L'email est déjà vérifié",
          requestId: generateId("req"),
        },
      },
      409
    );
  }

  const code = generateVerificationCode();
  verificationCodes.set(body.email, {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  console.log(`[MOCK] Nouveau code de vérification pour ${body.email}: ${code}`);

  return createResponse<ResendVerificationCodeResponse>(
    {
      status: "SENT",
    },
    200
  );
};

const handleLogin = async (body: LoginRequest): Promise<Response> => {
  await delay(500);

  const user = findUserByEmail(body.email);

  if (!user || user.password !== body.password) {
    return createResponse<ApiError>(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email ou mot de passe incorrect",
          requestId: generateId("req"),
        },
      },
      401
    );
  }

  if (!user.emailVerifiedAt) {
    return createResponse<ApiError>(
      {
        error: {
          code: "EMAIL_NOT_VERIFIED",
          message: "Veuillez vérifier votre email avant de vous connecter",
          requestId: generateId("req"),
        },
      },
      403
    );
  }

  const accessToken = generateToken();
  const refreshToken = generateToken();
  refreshTokens.set(refreshToken, user.id);
  accessTokens.set(accessToken, user.id);

  return createResponse<LoginResponse>(
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
    200,
    {
      "Set-Cookie": `cb_refresh=${refreshToken}; HttpOnly; Path=/; SameSite=Lax`,
    }
  );
};

const handleRefresh = async (cookies: string | null): Promise<Response> => {
  await delay(300);

  const refreshToken = cookies?.match(/cb_refresh=([^;]+)/)?.[1];

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return createResponse<ApiError>(
      {
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Token de rafraîchissement invalide",
          requestId: generateId("req"),
        },
      },
      401
    );
  }

  const userId = refreshTokens.get(refreshToken);
  if (!userId) {
    return createResponse<ApiError>(
      {
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Token de rafraîchissement invalide",
          requestId: generateId("req"),
        },
      },
      401
    );
  }

  const newAccessToken = generateToken();
  accessTokens.set(newAccessToken, userId);

  return createResponse<RefreshResponse>(
    {
      accessToken: newAccessToken,
    },
    200
  );
};

const handleLogout = async (token: string | null): Promise<Response> => {
  await delay(200);

  if (token) {
    accessTokens.delete(token);
  }

  return createEmptyResponse({
    "Set-Cookie": "cb_refresh=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0",
  });
};

const handleForgotPassword = async (body: ForgotPasswordRequest): Promise<Response> => {
  await delay(500);

  const user = findUserByEmail(body.email);

  if (user) {
    const token = generateToken();
    resetTokens.set(token, {
      token,
      expiresAt: Date.now() + 60 * 60 * 1000,
    });

    console.log(`[MOCK] Token de réinitialisation pour ${body.email}: ${token}`);
  }

  return createResponse<ForgotPasswordResponse>(
    {
      status: "SENT",
    },
    200
  );
};

const handleResetPassword = async (body: ResetPasswordRequest): Promise<Response> => {
  await delay(500);

  const storedToken = resetTokens.get(body.token);

  if (!storedToken) {
    return createResponse<ApiError>(
      {
        error: {
          code: "TOKEN_INVALID",
          message: "Token invalide",
          requestId: generateId("req"),
        },
      },
      400
    );
  }

  if (Date.now() > storedToken.expiresAt) {
    resetTokens.delete(body.token);
    return createResponse<ApiError>(
      {
        error: {
          code: "TOKEN_EXPIRED",
          message: "Le token a expiré",
          requestId: generateId("req"),
        },
      },
      400
    );
  }

  resetTokens.delete(body.token);

  return createResponse<ResetPasswordResponse>(
    {
      status: "RESET",
    },
    200
  );
};

const handleGetCurrentUser = async (token: string | null): Promise<Response> => {
  await delay(300);

  if (!token) {
    return createResponse<ApiError>(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Non authentifié",
          requestId: generateId("req"),
        },
      },
      401
    );
  }

  const userId = accessTokens.get(token);

  if (!userId) {
    return createResponse<ApiError>(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Token invalide",
          requestId: generateId("req"),
        },
      },
      401
    );
  }

  const user = users.get(userId);

  if (!user) {
    return createResponse<ApiError>(
      {
        error: {
          code: "USER_NOT_FOUND",
          message: "Utilisateur non trouvé",
          requestId: generateId("req"),
        },
      },
      404
    );
  }

  return createResponse<GetCurrentUserResponse>(
    {
      user: {
        id: user.id,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    200
  );
};

/**
 * Intercepte fetch pour les requêtes API en mode mock
 */
export function setupFetchMock() {
  if (typeof window === "undefined") return;

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method || "GET";

    // Ne mocker que les requêtes vers /api/v1 ou localhost:4000
    // Intercepter aussi les URLs absolues vers localhost:4000 (pour compatibilité)
    const isApiRequest = url.includes("/api/v1") || url.includes("localhost:4000");
    
    if (!isApiRequest) {
      return originalFetch(input, init);
    }

    try {
      // Extraire le path et les headers
      // Gérer les URLs relatives et absolues
      let urlObj: URL;
      try {
        urlObj = new URL(url);
      } catch {
        urlObj = new URL(url, window.location.origin);
      }
      
      // Normaliser le path
      let path = urlObj.pathname;
      
      // Si l'URL contient localhost:4000 mais pas /api/v1, ajouter /api/v1
      // Ex: http://localhost:4000/auth/register -> /api/v1/auth/register
      if (url.includes("localhost:4000")) {
        if (path.startsWith("/api/v1")) {
          // Déjà correct, garder tel quel
        } else if (path.startsWith("/auth/") || path.startsWith("/me")) {
          // Ajouter /api/v1 au début
          path = `/api/v1${path}`;
        } else {
          // Path inconnu, passer à fetch original
          return originalFetch(input, init);
        }
      }
      
      // S'assurer que le path commence par /api/v1
      if (!path.startsWith("/api/v1")) {
        // Si le path ne commence pas par /api/v1, passer à fetch original
        return originalFetch(input, init);
      }
      const headers = new Headers(init?.headers);

      // Ajouter les cookies depuis document.cookie si disponibles
      if (typeof document !== "undefined" && document.cookie) {
        const cookies = document.cookie;
        if (cookies) {
          headers.set("Cookie", cookies);
        }
      }

      // Parser le body si présent
      let body: unknown = undefined;
      if (init?.body) {
        try {
          body = JSON.parse(init.body as string);
        } catch {
          body = init.body;
        }
      }

      // Debug: logger les requêtes interceptées
      console.log(`[MOCK] Interception: ${method} ${path}`, { url, body: body ? "present" : "none" });
      
      // Router vers le bon handler
      if (path === `${API_BASE_URL}/auth/register` && method === "POST") {
        return handleRegister(body as RegisterRequest);
      }

      if (path === `${API_BASE_URL}/auth/verify-email` && method === "POST") {
        return handleVerifyEmail(body as VerifyEmailRequest);
      }

      if (path === `${API_BASE_URL}/auth/resend-verification-code` && method === "POST") {
        return handleResendVerificationCode(body as ResendVerificationCodeRequest);
      }

      if (path === `${API_BASE_URL}/auth/login` && method === "POST") {
        return handleLogin(body as LoginRequest);
      }

      if (path === `${API_BASE_URL}/auth/refresh` && method === "POST") {
        const cookies = headers.get("Cookie");
        return handleRefresh(cookies);
      }

      if (path === `${API_BASE_URL}/auth/logout` && method === "POST") {
        const token = headers.get("Authorization")?.replace("Bearer ", "") || null;
        return handleLogout(token);
      }

      if (path === `${API_BASE_URL}/auth/password/forgot` && method === "POST") {
        return handleForgotPassword(body as ForgotPasswordRequest);
      }

      if (path === `${API_BASE_URL}/auth/password/reset` && method === "POST") {
        return handleResetPassword(body as ResetPasswordRequest);
      }

      if (path === `${API_BASE_URL}/me` && method === "GET") {
        const token = headers.get("Authorization")?.replace("Bearer ", "") || null;
        return handleGetCurrentUser(token);
      }

      // Si aucune route ne correspond, passer à fetch original
      return originalFetch(input, init);
    } catch (error) {
      console.error("[MOCK] Erreur lors du mock:", error);
      return originalFetch(input, init);
    }
  };

  console.log("[MOCK] Fetch mock activé");
}

/**
 * Désactive le mock fetch
 */
export function teardownFetchMock() {
  if (typeof window === "undefined") return;
  // Note: On ne peut pas vraiment restaurer fetch, mais ce n'est pas nécessaire
  // car le mock est seulement activé en développement
}
